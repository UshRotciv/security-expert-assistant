import React, { useState, useMemo } from 'react';
import './App.css';
import { useTranslation } from 'react-i18next';

// Data derived from role-play and PDF
const rules = [
  // Rules from PDF
  {
    "id": "RULE-PDF-001",
    "assetType": "Workshop圖板",
    "description": "在設計或策略工作坊中產出的視覺化輸出物。包含工作坊輸出圖、各式分析圖(如架構圖、流程圖、市場分析、SWOT等)、Post-it筆記牆、張貼裱板、各式隨手筆記等。",
    "digitalManagement": "1. 如Miro、FigJam、Teams白板等線上共用連結需設定「限特定人員可檢視」。\n2. 建議會後截圖整理為PDF或圖片檔並存至專案雲端資料夾(命名含日期與主題)。",
    "physicalManagement": "1. 張貼裱板與Post-it等資料，會議後不得放於會議室中。若具保留價值，應於紀錄後銷毀。\n2. 若需保留紙本，請標註日期/專案，並妥善放置於指定的儲存空間。",
    "accessRights": "● 專案相關主管可調閱\n● 內容未經授權不可隨意拍照轉發\n● 內容於會議外部使用前須經專案負責人核准",
    "externalCommunication": "● 傳遞僅限使用公司Teams、Email或OneDrive\n● 禁用個人通訊軟體、社群軟體、Email\n● 需加*浮水印"
  },
  {
    "id": "RULE-PDF-002",
    "assetType": "線上協作共編檔案",
    "description": "數位形式如: OneNote / Notion / Teams 共編筆記 / Miro / FigJam 共編 / Excel。",
    "digitalManagement": "1. 僅限專案成員可存取，禁用「任何人可編輯」設定。\n2. 須由檔案擁有者定期備份，並存入正式儲存系統(如專案或公用OneDrive/Teams Project資料夾/server)。",
    "physicalManagement": "1. 若列印作為會議資料或工作坊輸出，使用後應回收或銷毀。\n2. 若需保留紙本，請標註日期/專案，並妥善放置於指定的儲存空間。",
    "accessRights": "● 未定稿內容須加註「初稿僅供討論」，不得任意拍照或外傳\n● 由專案負責人管理，僅限專案內部相關之設計、研發成員與專案主管使用\n● 僅限專案成員可寫入，專案主管可審閱，或視情況編輯，連結不得開放給華碩外部人士",
    "externalCommunication": "● 內容於專案外部使用前須經專案主管核准\n● 須以「共用連結」形式並透過公司Teams或email傳遞。\n● 傳遞連結須限制為「只能檢視」或「指定人員編輯」"
  },
  // ... (rest of the PDF rules)

  // New rules from role-play
  {
    "id": "RULE-RP-001",
    "assetType": "善意行為",
    "description": "出於善意幫助同事處理事務，或無意間接觸到非自身業務範圍的資訊。",
    "digitalManagement": "遵循『職責分離』和『最小權限』原則，不處理非權責內的數位資訊。",
    "physicalManagement": "不代拿或翻閱非自己權責的實體文件，如列印成品。尊重專案的物理邊界，非相關人員不進入核心開發區域。",
    "accessRights": "僅能存取和處理自身業務相關的資訊。",
    "externalCommunication": "避免在無意中洩漏任何可能在工作環境中看到的資訊。"
  },
  {
    "id": "RULE-RP-002",
    "assetType": "未鎖定的電腦",
    "description": "離開座位時未鎖定個人電腦。",
    "digitalManagement": "養成『人離鎖機』的習慣，即使只是短暫離開。這可以防止未經授權的存取、資料外洩或惡意軟體植入。",
    "physicalManagement": "N/A",
    "accessRights": "未鎖定的電腦等同於將所有權限開放給任何路過的人。",
    "externalCommunication": "攻擊者可能利用未鎖定的電腦，以你的名義發送詐騙郵件或竊取資料。"
  },
  {
    "id": "RULE-RP-003",
    "assetType": "實體產出物 (設計圖、模型)",
    "description": "設計圖、模型、會議筆記等實體資料。",
    "digitalManagement": "若有數位化版本，需妥善管理其存取權限。",
    "physicalManagement": "1. 隨意丟棄：所有草圖、筆記都應用碎紙機銷毀.\n2. 不當儲存：應存放於上鎖的儲存櫃，而非開放空間.\n3. 缺乏標示：應標示機密等級.\n4. 移動過程：應使用不透明的袋子或文件夾遮蔽。",
    "accessRights": "僅限授權人員存取。",
    "externalCommunication": "在公司外處理或討論實體產出物需格外小心。"
  },
  {
    "id": "RULE-RP-004",
    "assetType": "手機拍攝會議紀錄",
    "description": "使用個人手機拍攝白板或會議紀錄。",
    "digitalManagement": "1. 拍照前確認：確保無敏感資訊.\n2. 及時轉存：會後立即將照片上傳至公司安全空間，並從手機『徹底刪除』.\n3. 禁止自動同步：關閉個人雲端相簿的自動同步功能.\n4. 定期檢查：定期清理手機相簿。",
    "physicalManagement": "N/A",
    "accessRights": "個人裝置僅為『暫存』和『傳輸』工具，非『儲存』地點。",
    "externalCommunication": "禁止將存有公司資訊的手機照片同步至個人雲端。"
  },
  {
    "id": "RULE-RP-005",
    "assetType": "公開AI平台",
    "description": "將工作資訊上傳到公開的生成式AI平台。",
    "digitalManagement": "嚴格禁止使用公開的生成式AI工具處理任何與業務相關的資訊。上傳資料等同於將其所有權和控制權交給平台，且資料幾乎無法被真正刪除。",
    "physicalManagement": "N/A",
    "accessRights": "一旦上傳，資料可能被用於訓練模型，並洩漏給競爭對手。",
    "externalCommunication": "此行為違反保密協議，並帶來極大的技術與法律風險。"
  },
  {
    "id": "RULE-RP-006",
    "assetType": "檔案分享",
    "description": "透過附件或共用連結分享檔案。",
    "digitalManagement": "優先使用『共用連結』而非『附件』，因為前者保有控制權。\n權限設定三要點：\n1. 最小權限：預設為『檢視』。\n2. 指定對象：明確指定接收者的公司帳號。\n3. 設定到期日：專案結束後自動失效。",
    "physicalManagement": "N/A",
    "accessRights": "嚴格控制共用連結的存取權限。",
    "externalCommunication": "若對方聲稱無法接收連結，應透過IT部門的『大檔案傳輸』機制處理，而非直接寄送附件。"
  },
  {
    "id": "RULE-RP-007",
    "assetType": "加密檔案與密碼",
    "description": "傳遞加密的敏感文件。",
    "digitalManagement": "密碼和檔案必須分開傳遞，使用不同的通訊方式（如Email寄檔案，Teams傳密碼）。",
    "physicalManagement": "N/A",
    "accessRights": "確保只有授權的接收者能同時獲得檔案和密碼。",
    "externalCommunication": "絕不將密碼寫在與加密檔案相同的郵件或訊息中。"
  },
  {
    "id": "RULE-RP-008",
    "assetType": "浮水印",
    "description": "在敏感文件上加上浮水印。",
    "digitalManagement": "使用IT部門提供的工具，自動在文件上加入『公司機密』、『使用者名稱』和『存取時間』的浮水印，以利追溯。",
    "physicalManagement": "N/A",
    "accessRights": "N/A",
    "externalCommunication": "所有對外提供的敏感文件都應加上浮水印。"
  },
  {
    "id": "RULE-RP-009",
    "assetType": "跨團隊資訊共享",
    "description": "與內部其他團隊、跨BU或外部廠商共享資訊。",
    "digitalManagement": "核心原則：『逐級授權』與『留下紀錄』。\n對外共享前，進行自查三問：\n1. 我的主管知道嗎？\n2. 對方有簽NDA嗎？\n3. 我使用的平台是公司核可的嗎？",
    "physicalManagement": "N/A",
    "accessRights": "所有跨BU或對外的共享，都必須經過主管同意和正式流程。",
    "externalCommunication": "嚴禁使用私人的通訊軟體或Email進行對外資料交換。"
  },
  {
    "id": "RULE-RP-010",
    "assetType": "遠端工作網路連線",
    "description": "在飯店、咖啡廳等場所使用公開Wi-Fi。",
    "digitalManagement": "最安全的做法：\n1. 手機熱點優先.\n2. 先連VPN再上網.\n3. 關閉電腦的檔案分享功能.\n4. 保持系統和防毒軟體更新。",
    "physicalManagement": "N/A",
    "accessRights": "將任何外部網路都視為有風險的。",
    "externalCommunication": "即使使用VPN，在連線前的空窗期仍有風險。"
  },
  {
    "id": "RULE-RP-011",
    "assetType": "個人作品集",
    "description": "將在職期間的設計產出（草圖、Mockup、廢案）放入個人作品集。",
    "digitalManagement": "在未獲得公司法務與事業單位主管的『書面』同意前，一律不准以任何形式公開。預設為『完全禁止』。",
    "physicalManagement": "N/A",
    "accessRights": "所有在職期間的產出，其智慧財產權均屬於公司。",
    "externalCommunication": "任何形式的公開展示皆需通過正式申請與審批流程。"
  },
  {
    "id": "RULE-RP-012",
    "assetType": "實體模型報廢",
    "description": "報廢開發過程中的實體模型。",
    "digitalManagement": "N/A",
    "physicalManagement": "定義：使其無法被還原、辨識或推斷出原始設計。\n方法：必須進行物理性破壞（切割、鑽孔、破碎），並交由合規廠商處理。\n流程：建議拍照存證，並有兩位同仁在場見證。",
    "accessRights": "N/A",
    "externalCommunication": "嚴禁將完整的模型直接丟棄或回收。"
  }
];

interface Rule {
  id: string;
  assetType: string;
  description: string;
  digitalManagement: string;
  physicalManagement: string;
  accessRights: string;
  externalCommunication: string;
}

const RuleCard: React.FC<{ rule: Rule }> = ({ rule }) => {
  const { t } = useTranslation();
  return (
    <div className="rule-card">
      <h3>{rule.assetType}</h3>
      <p><span className="label">{t('descriptionLabel')}</span> {rule.description}</p>
      <p><span className="label">{t('digitalManagementLabel')}</span></p>
      <ul>
        {rule.digitalManagement.split('\n').map((item, index) => (
          item.trim() !== '' && <li key={index}>{item.trim()}</li>
        ))}
      </ul>
      <p><span className="label">{t('physicalManagementLabel')}</span></p>
      <ul>
        {rule.physicalManagement.split('\n').map((item, index) => (
          item.trim() !== '' && <li key={index}>{item.trim()}</li>
        ))}
      </ul>
      <p><span className="label">{t('accessRightsLabel')}</span></p>
      <ul>
        {rule.accessRights.split('\n').map((item, index) => (
          item.trim() !== '' && <li key={index}>{item.trim()}</li>
        ))}
      </ul>
      <p><span className="label">{t('externalCommunicationLabel')}</span></p>
      <ul>
        {rule.externalCommunication.split('\n').map((item, index) => (
          item.trim() !== '' && <li key={index}>{item.trim()}</li>
        ))}
      </ul>
    </div>
  );
};

function App() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRules = useMemo(() => {
    return rules.filter(rule => {
      const searchContent = (
        rule.assetType +
        rule.description +
        rule.digitalManagement +
        rule.physicalManagement +
        rule.accessRights +
        rule.externalCommunication
      ).toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>{t('appTitle')}</h1>
        <div className="language-switcher">
          <label htmlFor="language-select">{t('language')}: </label>
          <select id="language-select" onChange={(e) => changeLanguage(e.target.value)} value={i18n.language}>
            <option value="zh">{t('chinese')}</option>
            <option value="en">{t('english')}</option>
          </select>
        </div>
      </header>
      <main>
        <div className="controls">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="rule-list">
          {filteredRules.map(rule => (
            <RuleCard key={rule.id} rule={rule} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;