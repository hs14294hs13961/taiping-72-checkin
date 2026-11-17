/**
 * 新竹縣關西鎮太平國民小學 72週年校慶 — 貴賓簽到系統共用模組
 */
window.TP72Checkin = (function () {
  const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbxGnG_dMcOzxlhLnVGCDJtRvx-qgZbXXSU1-POCmb-rxnc0p8g2Jf3tizTDBceOP5pr8Q/exec';
  const STORAGE_GAS_KEY = 'tp72_checkin_gas_url';
  const STORAGE_DEMO_KEY = 'tp72_checkin_demo_data';

  const DEFAULT_CATEGORIES = [
    '鎮公所與代表會',
    '立委與縣議員',
    '里長與鄰長',
    '社區與地方社團',
    '企業與榮譽貴賓',
    '現場臨時來賓'
  ];

  const DEFAULT_GUESTS = [
    { id: 'TP72-001', name: '陳光彩', title: '關西鎮鎮長', category: '鎮公所與代表會', checkedIn: false, checkinTime: '', note: '可填代理' },
    { id: 'TP72-002', name: '徐欣瑩', title: '立法委員', category: '立委與縣議員', checkedIn: false, checkinTime: '', note: '可填助理' },
    { id: 'TP72-003', name: '羅仕琦', title: '新竹縣議員', category: '立委與縣議員', checkedIn: false, checkinTime: '', note: '可填助理' },
    { id: 'TP72-004', name: '徐瑜新', title: '新竹縣議員', category: '立委與縣議員', checkedIn: false, checkinTime: '', note: '可填助理' },
    { id: 'TP72-005', name: '羅仕典', title: '新竹縣關西鎮民代表會主席', category: '鎮公所與代表會', checkedIn: false, checkinTime: '', note: '可填助理' },
    { id: 'TP72-006', name: '葉文燈', title: '新竹縣關西鎮民代表會副主席', category: '鎮公所與代表會', checkedIn: false, checkinTime: '', note: '可填助理' },
    { id: 'TP72-007', name: '李常棟', title: '新竹縣關西鎮民代表會代表', category: '鎮公所與代表會', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-008', name: '范良宇', title: '新竹縣關西鎮民代表會代表', category: '鎮公所與代表會', checkedIn: false, checkinTime: '', note: '可填助理' },
    { id: 'TP72-009', name: '鄧光明', title: '東平里里長', category: '里長與鄰長', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-010', name: '李昌海', title: '新竹縣關西鎮東平里社區發展協會理事長', category: '社區與地方社團', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-011', name: '黃淼霖', title: '新竹縣關西鎮東平里產業發展協會理事長', category: '社區與地方社團', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-012', name: '劉華泉', title: '新竹縣各級學校家長協會關西區執行長', category: '社區與地方社團', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-013', name: '簡國徽', title: '台北雙連扶輪社會長', category: '社區與地方社團', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-014', name: '蔡澄均', title: '關西鎮農會理事長', category: '社區與地方社團', checkedIn: false, checkinTime: '', note: '可填助理' },
    { id: 'TP72-015', name: '蔡馥如', title: '啟碁科技股份有限公司總監', category: '企業與榮譽貴賓', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-016', name: '范綱田', title: '頂尖教育中心董事長', category: '企業與榮譽貴賓', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-017', name: '詹乾明', title: '將軍', category: '企業與榮譽貴賓', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-018', name: '爐緯洲', title: '新竹縣石光派出所所長', category: '企業與榮譽貴賓', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-019', name: '張春喻', title: '翔喻食品有限公司董事長', category: '企業與榮譽貴賓', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-020', name: '黃國憲', title: '關西鎮前鎮長', category: '企業與榮譽貴賓', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-021', name: '許應深', title: '桃園縣前代理縣長／董事長', category: '企業與榮譽貴賓', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-022', name: '蘇祐德', title: '虹錡生技有限公司董事長', category: '企業與榮譽貴賓', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-023', name: '范定緯', title: '雲海休閒茶廠董事長', category: '企業與榮譽貴賓', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-024', name: '木蘭工程有限公司', title: '企業貴賓', category: '企業與榮譽貴賓', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-025', name: '劉宴君', title: '東平里第一鄰鄰長', category: '里長與鄰長', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-026', name: '劉宗燈', title: '東平里第二鄰鄰長', category: '里長與鄰長', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-027', name: '謝維乾', title: '東平里第三鄰鄰長', category: '里長與鄰長', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-028', name: '黎吳富梅', title: '東平里第四鄰鄰長', category: '里長與鄰長', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-029', name: '朱金富', title: '東平里第五鄰鄰長', category: '里長與鄰長', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-030', name: '徐瑞娟', title: '東平里第七鄰鄰長', category: '里長與鄰長', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-031', name: '許應光', title: '東平里第八鄰鄰長', category: '里長與鄰長', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-032', name: '余玉珍', title: '東平里第九鄰鄰長', category: '里長與鄰長', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-033', name: '蔡清枝', title: '東平里第十鄰鄰長', category: '里長與鄰長', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-034', name: '黃常淡', title: '東平里第十一鄰鄰長', category: '里長與鄰長', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-035', name: '朱運崇', title: '東平里第十二鄰鄰長', category: '里長與鄰長', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-036', name: '朱火燈', title: '東平里第十三鄰鄰長', category: '里長與鄰長', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-037', name: '呂學博', title: '東平里第十四鄰鄰長', category: '里長與鄰長', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-038', name: '劉源雄', title: '東平里第十五鄰鄰長', category: '里長與鄰長', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-039', name: '葉陳蘭妹', title: '東平里第十六鄰鄰長', category: '里長與鄰長', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-040', name: '李潤興', title: '東平里第十七鄰鄰長', category: '里長與鄰長', checkedIn: false, checkinTime: '', note: '' },
    { id: 'TP72-041', name: '林萬富', title: '東平里第十八鄰鄰長', category: '里長與鄰長', checkedIn: false, checkinTime: '', note: '' }
  ];

  function getGasUrl() {
    const params = new URLSearchParams(window.location.search);
    const fromParam = params.get('gas');
    if (fromParam && fromParam.trim()) {
      const clean = fromParam.trim();
      localStorage.setItem(STORAGE_GAS_KEY, clean);
      return clean;
    }
    return localStorage.getItem(STORAGE_GAS_KEY) || DEFAULT_GAS_URL;
  }

  function setGasUrl(url) {
    const clean = (url || '').trim();
    if (clean) {
      localStorage.setItem(STORAGE_GAS_KEY, clean);
    } else {
      localStorage.removeItem(STORAGE_GAS_KEY);
    }
  }

  function nowTimeString() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function loadLocalData() {
    try {
      const raw = localStorage.getItem(STORAGE_DEMO_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.guests) && parsed.guests.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    const initial = {
      guests: JSON.parse(JSON.stringify(DEFAULT_GUESTS)),
      categories: [...DEFAULT_CATEGORIES]
    };
    saveLocalData(initial);
    return initial;
  }

  function saveLocalData(data) {
    localStorage.setItem(STORAGE_DEMO_KEY, JSON.stringify(data));
  }

  async function fetchGuests(force = false) {
    const gasUrl = getGasUrl();
    if (!gasUrl) {
      const local = loadLocalData();
      return { ok: true, mode: 'local', guests: local.guests, categories: local.categories };
    }
    const sep = gasUrl.includes('?') ? '&' : '?';
    const url = force ? `${gasUrl}${sep}force=1&t=${Date.now()}` : `${gasUrl}${sep}t=${Date.now()}`;
    const res = await fetch(url, { method: 'GET' });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || '讀取雲端資料失敗');
    return { ok: true, mode: 'cloud', guests: json.guests || [], categories: json.categories || DEFAULT_CATEGORIES };
  }

  async function postAction(payload) {
    const gasUrl = getGasUrl();
    if (!gasUrl) {
      const local = loadLocalData();
      if (payload.action === 'checkin') {
        const g = local.guests.find((x) => x.id === payload.id);
        if (g) {
          g.checkedIn = Boolean(payload.checkedIn);
          g.checkinTime = g.checkedIn ? nowTimeString() : '';
          if (payload.note !== undefined) g.note = payload.note;
        }
      } else if (payload.action === 'addGuest') {
        const newId = 'TP72-W' + Date.now().toString().slice(-5);
        local.guests.push({
          id: newId,
          name: payload.name,
          title: payload.title || '',
          category: payload.category || '現場臨時來賓',
          checkedIn: payload.checkedIn !== false,
          checkinTime: payload.checkedIn !== false ? nowTimeString() : '',
          note: payload.note || ''
        });
      } else if (payload.action === 'updateGuest') {
        const g = local.guests.find((x) => x.id === payload.id);
        if (g) {
          if (payload.name !== undefined) g.name = payload.name;
          if (payload.title !== undefined) g.title = payload.title;
          if (payload.category !== undefined) g.category = payload.category;
          if (payload.note !== undefined) g.note = payload.note;
        }
      } else if (payload.action === 'resetAllStatus') {
        local.guests.forEach((g) => {
          g.checkedIn = false;
          g.checkinTime = '';
        });
      } else if (payload.action === 'bulkImport') {
        const list = Array.isArray(payload.guests) ? payload.guests : [];
        const baseTs = Date.now();
        list.forEach((item, idx) => {
          if (!item.name) return;
          local.guests.push({
            id: 'TP72-B' + String(baseTs + idx).slice(-5),
            name: item.name,
            title: item.title || '',
            category: item.category || '現場臨時來賓',
            checkedIn: false,
            checkinTime: '',
            note: ''
          });
        });
      }
      saveLocalData(local);
      return { ok: true, mode: 'local', data: { guests: local.guests, categories: local.categories } };
    }

    const res = await fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || '更新雲端資料失敗');
    return { ok: true, mode: 'cloud', data: json.data };
  }

  function resetLocalDemo() {
    localStorage.removeItem(STORAGE_DEMO_KEY);
    return loadLocalData();
  }

  return {
    DEFAULT_CATEGORIES,
    getGasUrl,
    setGasUrl,
    fetchGuests,
    postAction,
    resetLocalDemo
  };
})();
