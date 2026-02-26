const MIN_YEAR = 907;
const MAX_YEAR = 979;

const regimes = [
  { id: 'LaterLiang', name: '后梁', start: 907, end: 923, capital: '开封', type: '五代', notes: '五代首个中原王朝。' },
  { id: 'LaterTang', name: '后唐', start: 923, end: 936, capital: '洛阳', type: '五代', notes: '由沙陀李存勖建立。' },
  { id: 'LaterJin', name: '后晋', start: 936, end: 947, capital: '开封', type: '五代', notes: '石敬瑭建立，割让燕云十六州。' },
  { id: 'LaterHan', name: '后汉', start: 947, end: 951, capital: '开封', type: '五代', notes: '国祚较短。' },
  { id: 'LaterZhou', name: '后周', start: 951, end: 960, capital: '开封', type: '五代', notes: '改革为北宋统一奠基。' },
  { id: 'WuYue', name: '吴越', start: 907, end: 978, capital: '杭州', type: '十国', notes: '江南政权，经济较繁荣。' },
  { id: 'Min', name: '闽', start: 909, end: 945, capital: '福州', type: '十国', notes: '福建地区政权。' },
  { id: 'Chu', name: '楚（马楚）', start: 907, end: 951, capital: '长沙', type: '十国', notes: '湖南地区主要政权。' },
  { id: 'SouthernHan', name: '南汉', start: 917, end: 971, capital: '兴王府（广州）', type: '十国', notes: '岭南地区政权。' },
  { id: 'Jingnan', name: '荆南（南平）', start: 924, end: 963, capital: '江陵', type: '十国', notes: '长江中游小政权。' },
  { id: 'SouthernTang', name: '南唐', start: 937, end: 975, capital: '金陵', type: '十国', notes: '南方强国之一。' },
  { id: 'FormerShu', name: '前蜀', start: 907, end: 925, capital: '成都', type: '十国', notes: '四川盆地政权。' },
  { id: 'LaterShu', name: '后蜀', start: 934, end: 965, capital: '成都', type: '十国', notes: '继前蜀后再据蜀地。' },
  { id: 'NorthernHan', name: '北汉', start: 951, end: 979, capital: '太原', type: '十国', notes: '存续至宋初。' },
  { id: 'NorthernSong', name: '北宋（统一进程）', start: 960, end: 979, capital: '开封', type: '统一进程', notes: '逐步结束分裂局面。' }
];

const cardsContainer = document.getElementById('regime-cards');
const cardTemplate = document.getElementById('card-template');
const yearRange = document.getElementById('yearRange');
const yearValue = document.getElementById('yearValue');
const timeline = document.getElementById('timeline');
const selectionInfo = document.getElementById('selection-info');
const resetSelectionBtn = document.getElementById('resetSelection');

let selectedId = null;
let currentYear = Number(yearRange.value);

function inYear(regime, year) {
  return year >= regime.start && year <= regime.end;
}

function clearStateClasses(el) {
  el.classList.remove('in-year', 'selected', 'out-year');
}

function renderTimeline() {
  timeline.innerHTML = '';
  const total = MAX_YEAR - MIN_YEAR;

  regimes.forEach((regime) => {
    const row = document.createElement('div');
    row.className = 'timeline-row';

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = `${regime.name} (${regime.start}-${regime.end})`;

    const barWrap = document.createElement('div');
    barWrap.className = 'bar-wrap';

    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.left = `${((regime.start - MIN_YEAR) / total) * 100}%`;
    bar.style.width = `${((regime.end - regime.start) / total) * 100}%`;

    barWrap.appendChild(bar);
    row.append(name, barWrap);
    timeline.appendChild(row);
  });
}

function renderCards() {
  cardsContainer.innerHTML = '';
  regimes.forEach((regime) => {
    const node = cardTemplate.content.firstElementChild.cloneNode(true);
    node.dataset.id = regime.id;
    node.querySelector('h3').textContent = regime.name;
    node.querySelector('.period').textContent = `时间：${regime.start}–${regime.end}`;
    node.querySelector('.capital').textContent = `都城：${regime.capital}`;
    node.querySelector('.type').textContent = `类型：${regime.type}`;
    node.querySelector('.notes').textContent = regime.notes;

    node.addEventListener('click', () => {
      selectedId = regime.id;
      syncUI();
    });

    node.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectedId = regime.id;
        syncUI();
      }
    });

    cardsContainer.appendChild(node);
  });
}

function updateMapAndCards() {
  regimes.forEach((regime) => {
    const mapNode = document.getElementById(regime.id);
    const cardNode = document.querySelector(`.card[data-id="${regime.id}"]`);
    const alive = inYear(regime, currentYear);
    const isSelected = selectedId === regime.id;

    if (mapNode) {
      clearStateClasses(mapNode);
      mapNode.classList.add(alive ? 'in-year' : 'out-year');
      if (isSelected) mapNode.classList.add('selected');

      mapNode.setAttribute('tabindex', '0');
      mapNode.onclick = () => {
        selectedId = regime.id;
        syncUI();
      };
      mapNode.onkeydown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectedId = regime.id;
          syncUI();
        }
      };
    }

    if (cardNode) {
      cardNode.classList.remove('selected', 'in-year', 'hidden');

      if (selectedId) {
        if (isSelected) {
          cardNode.classList.add('selected');
        } else {
          cardNode.classList.add('hidden');
        }
      } else if (alive) {
        cardNode.classList.add('in-year');
      }
    }
  });
}

function updateInfo() {
  const selectedRegime = regimes.find((item) => item.id === selectedId);
  if (selectedRegime) {
    selectionInfo.textContent = `已选中：${selectedRegime.name}（${selectedRegime.start}–${selectedRegime.end}，${selectedRegime.capital}）。`;
    return;
  }

  const activeList = regimes.filter((item) => inYear(item, currentYear)).map((item) => item.name);
  selectionInfo.textContent = `${currentYear} 年仍存在政权：${activeList.join('、') || '无'}。`;
}

function syncUI() {
  yearValue.textContent = String(currentYear);
  updateMapAndCards();
  updateInfo();
}

yearRange.addEventListener('input', () => {
  currentYear = Number(yearRange.value);
  syncUI();
});

resetSelectionBtn.addEventListener('click', () => {
  selectedId = null;
  syncUI();
});

renderTimeline();
renderCards();
syncUI();
