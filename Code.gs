/**
 * 新竹縣關西鎮太平國民小學 72週年校慶 — 貴賓簽到系統 GAS 後端
 *
 * 【使用方式】
 * 1. 在您的 Google 試算表點選「擴充功能 > Apps Script」，貼上本程式碼並儲存。
 * 2. 在編輯器上方函式下拉選單選擇「initTaiping72Data」並點「執行」（首次會要求授權），
 *    即可自動清除舊範本資料，匯入太平國小 72 週年 41 位貴賓名單與分類設定！
 * 3. 點選右上角「部署 > 新增部署作業」→ 類型選「網頁應用程式」→ 執行身分選「我」→
 *    誰可以存取務必選「所有人 (Anyone)」→ 部署並複製 /exec 網址。
 */

const SPREADSHEET_ID = ''; // 留空即自動綁定當前試算表；若為獨立 GAS 專案請填入試算表 ID
const GUESTS_SHEET = 'Guests';
const SETTINGS_SHEET = 'Settings';
const CACHE_KEY = 'TP72_GUESTS_CACHE_V1';

const DEFAULT_CATEGORIES = [
  '鎮公所與代表會',
  '立委與縣議員',
  '里長與鄰長',
  '社區與地方社團',
  '企業與榮譽貴賓',
  '現場臨時來賓'
];

const TAIPING_72_GUESTS = [
  ['TP72-001', '陳光彩', '關西鎮鎮長', '鎮公所與代表會', false, '', '可填代理'],
  ['TP72-002', '徐欣瑩', '立法委員', '立委與縣議員', false, '', '可填助理'],
  ['TP72-003', '羅仕琦', '新竹縣議員', '立委與縣議員', false, '', '可填助理'],
  ['TP72-004', '徐瑜新', '新竹縣議員', '立委與縣議員', false, '', '可填助理'],
  ['TP72-005', '羅仕典', '新竹縣關西鎮民代表會主席', '鎮公所與代表會', false, '', '可填助理'],
  ['TP72-006', '葉文燈', '新竹縣關西鎮民代表會副主席', '鎮公所與代表會', false, '', '可填助理'],
  ['TP72-007', '李常棟', '新竹縣關西鎮民代表會代表', '鎮公所與代表會', false, '', ''],
  ['TP72-008', '范良宇', '新竹縣關西鎮民代表會代表', '鎮公所與代表會', false, '', '可填助理'],
  ['TP72-009', '鄧光明', '東平里里長', '里長與鄰長', false, '', ''],
  ['TP72-010', '李昌海', '新竹縣關西鎮東平里社區發展協會理事長', '社區與地方社團', false, '', ''],
  ['TP72-011', '黃淼霖', '新竹縣關西鎮東平里產業發展協會理事長', '社區與地方社團', false, '', ''],
  ['TP72-012', '劉華泉', '新竹縣各級學校家長協會關西區執行長', '社區與地方社團', false, '', ''],
  ['TP72-013', '簡國徽', '台北雙連扶輪社會長', '社區與地方社團', false, '', ''],
  ['TP72-014', '蔡澄均', '關西鎮農會理事長', '社區與地方社團', false, '', '可填助理'],
  ['TP72-015', '蔡馥如', '啟碁科技股份有限公司總監', '企業與榮譽貴賓', false, '', ''],
  ['TP72-016', '范綱田', '頂尖教育中心董事長', '企業與榮譽貴賓', false, '', ''],
  ['TP72-017', '詹乾明', '將軍', '企業與榮譽貴賓', false, '', ''],
  ['TP72-018', '爐緯洲', '新竹縣石光派出所所長', '企業與榮譽貴賓', false, '', ''],
  ['TP72-019', '張春喻', '翔喻食品有限公司董事長', '企業與榮譽貴賓', false, '', ''],
  ['TP72-020', '黃國憲', '關西鎮前鎮長', '企業與榮譽貴賓', false, '', ''],
  ['TP72-021', '許應深', '桃園縣前代理縣長／董事長', '企業與榮譽貴賓', false, '', ''],
  ['TP72-022', '蘇祐德', '虹錡生技有限公司董事長', '企業與榮譽貴賓', false, '', ''],
  ['TP72-023', '范定緯', '雲海休閒茶廠董事長', '企業與榮譽貴賓', false, '', ''],
  ['TP72-024', '木蘭工程有限公司', '企業貴賓', '企業與榮譽貴賓', false, '', ''],
  ['TP72-025', '劉宴君', '東平里第一鄰鄰長', '里長與鄰長', false, '', ''],
  ['TP72-026', '劉宗燈', '東平里第二鄰鄰長', '里長與鄰長', false, '', ''],
  ['TP72-027', '謝維乾', '東平里第三鄰鄰長', '里長與鄰長', false, '', ''],
  ['TP72-028', '黎吳富梅', '東平里第四鄰鄰長', '里長與鄰長', false, '', ''],
  ['TP72-029', '朱金富', '東平里第五鄰鄰長', '里長與鄰長', false, '', ''],
  ['TP72-030', '徐瑞娟', '東平里第七鄰鄰長', '里長與鄰長', false, '', ''],
  ['TP72-031', '許應光', '東平里第八鄰鄰長', '里長與鄰長', false, '', ''],
  ['TP72-032', '余玉珍', '東平里第九鄰鄰長', '里長與鄰長', false, '', ''],
  ['TP72-033', '蔡清枝', '東平里第十鄰鄰長', '里長與鄰長', false, '', ''],
  ['TP72-034', '黃常淡', '東平里第十一鄰鄰長', '里長與鄰長', false, '', ''],
  ['TP72-035', '朱運崇', '東平里第十二鄰鄰長', '里長與鄰長', false, '', ''],
  ['TP72-036', '朱火燈', '東平里第十三鄰鄰長', '里長與鄰長', false, '', ''],
  ['TP72-037', '呂學博', '東平里第十四鄰鄰長', '里長與鄰長', false, '', ''],
  ['TP72-038', '劉源雄', '東平里第十五鄰鄰長', '里長與鄰長', false, '', ''],
  ['TP72-039', '葉陳蘭妹', '東平里第十六鄰鄰長', '里長與鄰長', false, '', ''],
  ['TP72-040', '李潤興', '東平里第十七鄰鄰長', '里長與鄰長', false, '', ''],
  ['TP72-041', '林萬富', '東平里第十八鄰鄰長', '里長與鄰長', false, '', '']
];

function getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== '') {
    return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
  }
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;

  const props = PropertiesService.getScriptProperties();
  const savedId = props.getProperty('AUTO_SPREADSHEET_ID');
  if (savedId) {
    try {
      return SpreadsheetApp.openById(savedId);
    } catch (e) {}
  }
  const created = SpreadsheetApp.create('太平國小72週年校慶貴賓簽到系統_資料庫');
  props.setProperty('AUTO_SPREADSHEET_ID', created.getId());
  return created;
}

function getOrCreateSheets() {
  const ss = getSpreadsheet();
  let guestsSheet = ss.getSheetByName(GUESTS_SHEET);
  if (!guestsSheet) {
    guestsSheet = ss.insertSheet(GUESTS_SHEET);
  }
  if (guestsSheet.getLastRow() === 0) {
    const headers = ['ID (系統自動生成)', '姓名', '職稱', '分類', '簽到狀態 (TRUE/FALSE)', '簽到時間', '備註 (本人/代理)'];
    guestsSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    guestsSheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#b71c1c')
      .setFontColor('#ffffff');
    guestsSheet.setFrozenRows(1);
  }

  let settingsSheet = ss.getSheetByName(SETTINGS_SHEET);
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet(SETTINGS_SHEET);
  }
  if (settingsSheet.getLastRow() === 0) {
    const rows = [['分類列表'], ...DEFAULT_CATEGORIES.map(c => [c])];
    settingsSheet.getRange(1, 1, rows.length, 1).setValues(rows);
    settingsSheet.getRange(1, 1).setFontWeight('bold').setBackground('#b71c1c').setFontColor('#ffffff');
  }

  return { ss, guestsSheet, settingsSheet };
}

/**
 * 一鍵初始化：清空舊範本資料，寫入太平國小 72 週年 41 位貴賓名單與分類設定
 */
function initTaiping72Data() {
  const { guestsSheet, settingsSheet } = getOrCreateSheets();

  // 清空並重建 Guests
  guestsSheet.clearContents();
  const headers = ['ID (系統自動生成)', '姓名', '職稱', '分類', '簽到狀態 (TRUE/FALSE)', '簽到時間', '備註 (本人/代理)'];
  const allRows = [headers, ...TAIPING_72_GUESTS];
  guestsSheet.getRange(1, 1, allRows.length, headers.length).setValues(allRows);
  guestsSheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#b71c1c')
    .setFontColor('#ffffff');
  guestsSheet.setFrozenRows(1);

  // 清空並重建 Settings
  settingsSheet.clearContents();
  const catRows = [['分類列表'], ...DEFAULT_CATEGORIES.map(c => [c])];
  settingsSheet.getRange(1, 1, catRows.length, 1).setValues(catRows);
  settingsSheet.getRange(1, 1)
    .setFontWeight('bold')
    .setBackground('#b71c1c')
    .setFontColor('#ffffff');

  clearCache();
  Logger.log('✅ 已成功建置太平國小 72 週年 41 位貴賓名單與 6 項分類！');
}

function clearCache() {
  try {
    CacheService.getScriptCache().remove(CACHE_KEY);
  } catch (e) {}
}

function formatTimeCell(val) {
  if (!val) return '';
  if (val instanceof Date) {
    return Utilities.formatDate(val, 'Asia/Taipei', 'HH:mm:ss');
  }
  return String(val).trim();
}

function readAllData(forceRefresh) {
  const cache = CacheService.getScriptCache();
  if (!forceRefresh) {
    const cached = cache.get(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  const { guestsSheet, settingsSheet } = getOrCreateSheets();
  const lastRow = guestsSheet.getLastRow();
  const lastCol = Math.max(guestsSheet.getLastColumn(), 7);
  const guests = [];

  if (lastRow >= 2) {
    const values = guestsSheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      const name = String(row[1] || '').trim();
      if (!name) continue;
      const rawStatus = row[4];
      const checkedIn = rawStatus === true || String(rawStatus).toUpperCase() === 'TRUE';
      guests.push({
        rowNumber: i + 2,
        id: String(row[0] || ('ROW-' + (i + 2))).trim(),
        name: name,
        title: String(row[2] || '').trim(),
        category: String(row[3] || '現場臨時來賓').trim(),
        checkedIn: checkedIn,
        checkinTime: checkedIn ? formatTimeCell(row[5]) : '',
        note: String(row[6] || '').trim()
      });
    }
  }

  const categories = [];
  const catLastRow = settingsSheet.getLastRow();
  if (catLastRow >= 2) {
    const catVals = settingsSheet.getRange(2, 1, catLastRow - 1, 1).getValues();
    for (let i = 0; i < catVals.length; i++) {
      const c = String(catVals[i][0] || '').trim();
      if (c && categories.indexOf(c) === -1) categories.push(c);
    }
  }

  const payload = {
    ok: true,
    guests: guests,
    categories: categories.length > 0 ? categories : DEFAULT_CATEGORIES,
    updatedAt: new Date().toISOString()
  };

  try {
    cache.put(CACHE_KEY, JSON.stringify(payload), 5);
  } catch (e) {}

  return payload;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    const force = e && e.parameter && e.parameter.force === '1';
    const data = readAllData(force);
    return jsonResponse(data);
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const action = body.action || '';
    const { guestsSheet } = getOrCreateSheets();

    // 確保第 7 欄標題存在
    if (guestsSheet.getLastColumn() < 7) {
      guestsSheet.getRange(1, 7).setValue('備註 (本人/代理)')
        .setFontWeight('bold').setBackground('#b71c1c').setFontColor('#ffffff');
    }

    if (action === 'checkin') {
      const targetId = String(body.id || '').trim();
      const checkedIn = Boolean(body.checkedIn);
      const note = body.note !== undefined ? String(body.note).trim() : null;
      const nowStr = checkedIn ? Utilities.formatDate(new Date(), 'Asia/Taipei', 'HH:mm:ss') : '';

      const lastRow = guestsSheet.getLastRow();
      if (lastRow < 2) return jsonResponse({ ok: false, error: '目前無貴賓資料' });

      const ids = guestsSheet.getRange(2, 1, lastRow - 1, 1).getValues();
      let foundRow = -1;
      for (let i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === targetId) {
          foundRow = i + 2;
          break;
        }
      }
      if (foundRow === -1) {
        return jsonResponse({ ok: false, error: '找不到指定貴賓 ID: ' + targetId });
      }

      guestsSheet.getRange(foundRow, 5).setValue(checkedIn);
      guestsSheet.getRange(foundRow, 6).setValue(nowStr);
      if (note !== null) {
        guestsSheet.getRange(foundRow, 7).setValue(note);
      }

      clearCache();
      return jsonResponse({ ok: true, id: targetId, checkedIn: checkedIn, checkinTime: nowStr, data: readAllData(true) });
    }

    if (action === 'addGuest') {
      const name = String(body.name || '').trim();
      const title = String(body.title || '').trim();
      const category = String(body.category || '現場臨時來賓').trim();
      const checkedIn = body.checkedIn !== false;
      const note = String(body.note || '').trim();

      if (!name) return jsonResponse({ ok: false, error: '姓名不可為空' });

      const newId = 'TP72-W' + Date.now().toString().slice(-6);
      const nowStr = checkedIn ? Utilities.formatDate(new Date(), 'Asia/Taipei', 'HH:mm:ss') : '';

      guestsSheet.appendRow([newId, name, title, category, checkedIn, nowStr, note]);
      clearCache();
      return jsonResponse({ ok: true, id: newId, data: readAllData(true) });
    }

    if (action === 'updateGuest') {
      const targetId = String(body.id || '').trim();
      const lastRow = guestsSheet.getLastRow();
      if (lastRow < 2) return jsonResponse({ ok: false, error: '找不到資料' });

      const ids = guestsSheet.getRange(2, 1, lastRow - 1, 1).getValues();
      let foundRow = -1;
      for (let i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === targetId) {
          foundRow = i + 2;
          break;
        }
      }
      if (foundRow === -1) return jsonResponse({ ok: false, error: '找不到指定貴賓' });

      if (body.name !== undefined) guestsSheet.getRange(foundRow, 2).setValue(String(body.name).trim());
      if (body.title !== undefined) guestsSheet.getRange(foundRow, 3).setValue(String(body.title).trim());
      if (body.category !== undefined) guestsSheet.getRange(foundRow, 4).setValue(String(body.category).trim());
      if (body.note !== undefined) guestsSheet.getRange(foundRow, 7).setValue(String(body.note).trim());

      clearCache();
      return jsonResponse({ ok: true, data: readAllData(true) });
    }

    if (action === 'resetAllStatus') {
      const lastRow = guestsSheet.getLastRow();
      if (lastRow >= 2) {
        guestsSheet.getRange(2, 5, lastRow - 1, 1).setValue(false);
        guestsSheet.getRange(2, 6, lastRow - 1, 1).setValue('');
      }
      clearCache();
      return jsonResponse({ ok: true, data: readAllData(true) });
    }

    if (action === 'bulkImport') {
      const list = Array.isArray(body.guests) ? body.guests : [];
      if (list.length > 0) {
        const baseTs = Date.now();
        const rows = list.map((g, idx) => [
          'TP72-B' + String(baseTs + idx).slice(-6),
          String(g.name || '').trim(),
          String(g.title || '').trim(),
          String(g.category || '現場臨時來賓').trim(),
          false,
          '',
          ''
        ]).filter(r => r[1] !== '');
        if (rows.length > 0) {
          guestsSheet.getRange(guestsSheet.getLastRow() + 1, 1, rows.length, 7).setValues(rows);
        }
      }
      clearCache();
      return jsonResponse({ ok: true, data: readAllData(true) });
    }

    return jsonResponse({ ok: false, error: '未知的操作: ' + action });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}
