"""Browser regression checks. Requires Selenium, Chromium and chromedriver."""
import functools
import http.server
import json
from pathlib import Path
import tempfile
import threading
from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait

ROOT = Path(__file__).resolve().parents[1]
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(QuietHandler, directory=str(ROOT / 'dist')))
threading.Thread(target=server.serve_forever, daemon=True).start()
options = Options()
options.binary_location = '/usr/bin/chromium'
for arg in ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1600,1100']:
    options.add_argument(arg)
options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})
with tempfile.TemporaryDirectory(prefix='certificate-test-') as folder:
    options.add_experimental_option('prefs', {'download.default_directory': folder, 'download.prompt_for_download': False})
    driver = webdriver.Chrome(service=Service('/usr/bin/chromedriver'), options=options)
    wait = WebDriverWait(driver, 10)
    def element(id): return driver.find_element(By.ID, id)
    def click(id): element(id).click()
    def state(): return driver.execute_script('return CertificateProjectIO.serializeProject()')
    def field(project, id='name'): return next(f for f in project['fields'] if f['id'] == id)
    def value(id, text):
        driver.execute_script('const e=document.getElementById(arguments[0]); e.value=arguments[1]; e.dispatchEvent(new Event("input",{bubbles:true}));', id, text)
    def select_layer(id='name'):
        driver.find_element(By.CSS_SELECTOR, f'.layer-button[data-id="{id}"]').click()
    def upload(name, text, input_id='dataUpload'):
        path = Path(folder) / name
        path.write_text(text)
        element(input_id).send_keys(str(path))
    try:
        driver.get(f'http://127.0.0.1:{server.server_port}/')
        wait.until(lambda _: element('validationSummary').text)
        assert driver.execute_script('return document.documentElement.lang') == 'pt-BR'
        assert not element('undoButton').is_enabled()
        initial = state()
        click('addFieldButton')
        assert len(state()['fields']) == 7
        click('undoButton')
        assert len(state()['fields']) == 6
        click('redoButton')
        assert len(state()['fields']) == 7
        click('undoButton')
        select_layer()
        original = field(state())['text']
        element('fieldText').click()
        element('fieldText').send_keys(Keys.CONTROL, 'a')
        element('fieldText').send_keys('Texto novo')
        click('undoButton')
        assert field(state())['text'] == original, field(state())
        click('redoButton')
        assert field(state())['text'] == 'Texto novo'
        click('undoButton')
        # Canvas shortcuts and drag are undoable; record navigation isn't.
        select_layer()
        driver.switch_to.active_element.send_keys(Keys.ARROW_RIGHT)
        assert field(state())['x'] == field(initial)['x'] + 1
        driver.switch_to.active_element.send_keys(Keys.CONTROL, 'z')
        assert field(state())['x'] == field(initial)['x']
        driver.switch_to.active_element.send_keys(Keys.CONTROL, 'y')
        assert field(state())['x'] == field(initial)['x'] + 1
        click('undoButton')
        select_layer()
        before_drag = field(state())['x']
        layer = driver.find_element(By.CSS_SELECTOR, '.canvas-field[data-id="name"]')
        ActionChains(driver).move_to_element(layer).click_and_hold().move_by_offset(35, 15).pause(.1).release().perform()
        assert field(state())['x'] != before_drag
        click('undoButton')
        assert field(state())['x'] == before_drag
        click('nextRecord')
        assert not element('undoButton').is_enabled()
        click('resetButton')
        click('blankTemplateButton')
        assert not state()['fields']
        click('undoButton')
        assert len(state()['fields']) == 6
        # Invalid imports preserve the current data and show a persistent error.
        before = state()['records']
        upload('bad.csv', 'name,name\nAna,Bia')
        wait.until(lambda _: element('dataImportError').is_displayed())
        assert state()['records'] == before
        assert 'repetido' in element('dataImportError').text
        upload('valid.csv', 'name;course;date;organization\nJoão;Web;30/09/2026;Escola\nAna;;30/09/2026;Escola')
        wait.until(lambda _: len(state()['records']) == 2)
        assert not element('dataImportError').is_displayed()
        assert 'course' in element('validationIssues').text
        assert '2' in element('validationIssues').text
        click('batchButton')
        assert not element('progressOverlay').is_displayed()
        assert 'dados ausentes' in element('toast').text
        click('undoButton')
        assert state()['records'] == before
        click('redoButton')
        assert len(state()['records']) == 2
        # A new edit after undo discards redo; clearing references clears preflight errors.
        click('undoButton')
        select_layer()
        value('fieldText', '{{nao_existe}}')
        assert not element('redoButton').is_enabled()
        assert 'nao_existe' in element('validationIssues').text
        click('undoButton')
        # Save roundtrip and restore prompt survive reload.
        driver.execute_async_script('CertificateProjectIO.autosaveNow().then(arguments[0]);')
        assert element('saveStatus').get_attribute('data-state') == 'saved'
        saved = state()
        driver.refresh()
        wait.until(lambda _: element('restoreBanner').is_displayed())
        assert element('saveStatus').get_attribute('data-state') == 'paused'
        click('restoreApplyButton')
        wait.until(lambda _: element('saveStatus').get_attribute('data-state') == 'saved')
        assert state()['fields'] == saved['fields']
        # Dismissing recovery preserves the old copy even while navigating records.
        driver.refresh()
        wait.until(lambda _: element('restoreBanner').is_displayed())
        click('restoreDismissButton')
        click('nextRecord')
        driver.execute_async_script('CertificateProjectIO.autosaveNow().then(arguments[0]);')
        # Explicit autosaveNow is a force-save; make another recovery point for the check.
        driver.refresh()
        wait.until(lambda _: element('restoreBanner').is_displayed())
        click('restoreDismissButton')
        click('nextRecord')
        assert element('saveStatus').get_attribute('data-state') == 'paused'
        # Force restores are undoable too.
        driver.execute_async_script('CertificateProjectIO.applyProject(arguments[0]).then(arguments[1]);', saved)
        # Loading an existing project and undoing it restores the entire design.
        imported = json.loads(json.dumps(saved))
        imported['design'] = {'width': 900, 'height': 700}
        imported['fields'][0]['text'] = 'Projeto importado'
        upload('saved.certproj.json', json.dumps(imported), 'loadProjectInput')
        wait.until(lambda _: state()['design']['width'] == 900)
        click('undoButton')
        assert state()['design'] == saved['design']
        click('redoButton')
        assert state()['design']['width'] == 900
        click('undoButton')
        # PNG, PDF and ZIP still download after successful validation.
        driver.execute_script('document.getElementById("exportQuality").value="normal";document.getElementById("exportQuality").dispatchEvent(new Event("change"));')
        for button, suffix in [('downloadPngButton', '.png'), ('downloadPdfButton', '.pdf'), ('batchButton', '.zip')]:
            click(button)
            wait.until(lambda _: any(p.suffix == suffix for p in Path(folder).iterdir()))
        # Edits made during an asynchronous write remain pending until the next save.
        driver.execute_script('''window.originalPut=IDBObjectStore.prototype.put;
          IDBObjectStore.prototype.put=function(...args) {
            const request=window.originalPut.apply(this,args);
            const e=document.getElementById('fieldText'); e.value='Alteração durante o salvamento';
            e.dispatchEvent(new Event('input',{bubbles:true})); return request;
          };''')
        select_layer()
        driver.execute_async_script('CertificateProjectIO.autosaveNow().then(arguments[0]);')
        assert element('saveStatus').get_attribute('data-state') == 'pending'
        driver.execute_script('IDBObjectStore.prototype.put=window.originalPut')
        driver.execute_async_script('CertificateProjectIO.autosaveNow().then(arguments[0]);')
        assert element('saveStatus').get_attribute('data-state') == 'saved'
        # Oversized autosaves must never be labelled as saved.
        driver.execute_script('''window.NativeBlob=Blob; window.Blob=class extends window.NativeBlob {
          get size(){return 81*1024*1024;}
        };''')
        driver.execute_async_script('CertificateProjectIO.autosaveNow().then(arguments[0]);')
        assert element('saveStatus').get_attribute('data-state') == 'error'
        assert '80 MB' in element('saveStatus').text
        driver.execute_script('window.Blob=window.NativeBlob')
        # Storage failure is visible and isn't overwritten by the next edit.
        driver.execute_script('window.originalPut=IDBObjectStore.prototype.put; IDBObjectStore.prototype.put=function(){throw new DOMException("quota", "QuotaExceededError")};')
        driver.execute_async_script('CertificateProjectIO.autosaveNow().then(arguments[0]);')
        assert element('saveStatus').get_attribute('data-state') == 'error'
        click('addShapeButton')
        assert element('saveStatus').get_attribute('data-state') == 'error'
        driver.execute_script('IDBObjectStore.prototype.put=window.originalPut')
        driver.execute_async_script('CertificateProjectIO.autosaveNow().then(arguments[0]);')
        assert element('saveStatus').get_attribute('data-state') == 'saved'
        driver.set_window_size(390, 844)
        assert element('saveStatus').is_displayed()
        assert element('undoButton').is_displayed()
        assert driver.execute_script('return document.documentElement.scrollWidth <= innerWidth + 1')
        driver.save_screenshot('/tmp/certificate-mobile.png')
        driver.set_window_size(1600, 1100)
        driver.save_screenshot('/tmp/certificate-desktop.png')
        errors = [entry for entry in driver.get_log('browser') if entry['level'] == 'SEVERE']
        assert not errors, errors
        print('PASS: tradução, histórico, arraste, atalhos, CSV, validação, exportações, projeto, recuperação, falha de armazenamento e layout móvel.')
    finally:
        driver.quit()
        server.shutdown()
