import React, { useState, useMemo } from 'react';
import './App.css';

// Data parsed from 設計中心通則資安管理辦法_20250707.pdf
const rules = [
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
  {
    "id": "RULE-PDF-003",
    "assetType": "簡報(PPT)",
    "description": "以PowerPoint等簡報格式製作的提案、專案更新或策略文件，含提案、產品規格、策略報告等。",
    "digitalManagement": "1. 應妥善儲存於限定位置(OA、個人掛帳裝置、公司雲端、ADC server)。個人掛帳裝置歸還前須把檔案清空。\n2. 禁止存於個人雲端、USB隨身碟、SSD等私人存儲裝置。\n3. 各階段檔案狀態需命名完整，完成版應轉存至存入正式儲存系統，含版本號與審閱狀態。",
    "physicalManagement": "1. 若列印簡報進行會議/展示，應標示「僅供內部使用」，使用後應回收或銷毀。\n2. 若需保留紙本，請標註日期/專案，並妥善放置於指定的儲存空間。",
    "accessRights": "● 由內容製作者保管，僅限內容相關之設計、研發成員、內容負責人與相關主管使用\n● 內容負責人須控管及調度",
    "externalCommunication": "● 對外需轉為.ppts或PDF格式，避免編輯，若須原檔須申請並經相關主管核可\n● 僅限透過公司Teams、email或 OneDrive傳遞\n● 內容於外部使用前須經相關主管核准\n● 外部廠商須具有華碩NDA授權方可使用\n● 所有對外簡報須加註*浮水印"
  },
  {
    "id": "RULE-PDF-004",
    "assetType": "PDF(簡報、報告、分析)",
    "description": "以PDF格式輸出的報告型資料，通常為審閱版本或發送用途。包含法務審閱過之合約報價PDF、趨勢報告、內部觀察報告等。",
    "digitalManagement": "1. 應妥善儲存於限定位置(OA、個人掛帳裝置、公司雲端、ADC server)。個人掛帳裝置歸還前須把檔案清空。\n2. 禁止存於個人雲端、USB隨身碟、SSD等私人存儲裝置.",
    "physicalManagement": "列印報告用途後應回收銷毀或妥善放置於指定的儲存空間。",
    "accessRights": "● 由內容製作者保管，僅限內容相關之設計、研發成員、內容負責人與相關主管使用\n● 內容負責人須控管及調度",
    "externalCommunication": "● 匯出PDF時必須設定*開啟密碼。\n● 檔案密碼與檔案本身須由不同管道分開傳遞(例如:檔案用Email，密碼用Teams訊息)。\n● 分享時應優先提供檔案「連結」而非附件\n● 內容於外部使用前須經相關主管核准\n● 外部廠商須具有華碩NDA授權方可使用\n● 若需對外提供，必須先取得內容相關專案主管審批。\n● 所有對外簡報須加註*浮水印"
  },
  {
    "id": "RULE-PDF-005",
    "assetType": "會議牆面、白板",
    "description": "實體會議室白板上的各種手寫筆記、架構、流程圖、臨時草圖、分工表或頭腦風暴輸出。",
    "digitalManagement": "1. 重要內容應轉移成數位形式保存。\n2. 拍照需在半天內上傳至指定檔案區，並從拍照裝置中刪除.",
    "physicalManagement": "1. 離開會議室之前須把內容(筆記跟post-it)清除乾淨。",
    "accessRights": "● 由會議招集人保管，僅限會議成員回顧與會議整理\n● 會議內容未經授權不可轉發",
    "externalCommunication": "● 轉為數位紀錄檔案(如照片)需要加上*浮水印。\n● 內容於會議外部使用前須經*內容負責人核准\n● 若透過連結分享，應關閉「公開」選項，權限需嚴格控管，僅限特定成員才能檢視。"
  },
  {
    "id": "RULE-PDF-006",
    "assetType": "會議錄影錄音",
    "description": "包含 Teams/Zoom/Google Meet錄影、內部研討紀錄、訪談紀錄影像(如與供應商或用戶)。",
    "digitalManagement": "1. 應妥善儲存於限定位置(OA、個人掛帳裝置、公司雲端、ADC server)。個人掛帳裝置歸還前須把檔案清空。\n2. 禁止存於個人雲端、USB隨身碟、SSD等私人存儲裝置。\n3. 命名格式包含會議主題與日期。",
    "physicalManagement": "若轉存成實體逐字稿，專案負責人應妥善保管。",
    "accessRights": "● 由會議招集人保管，僅限會議成員回顧與會議整理\n● 儲存平台設定權限未經授權不可轉發",
    "externalCommunication": "● 內容於會議外部使用前須經*內容負責人核准\n● 傳遞僅限使用公司Teams、Email或OneDrive\n● 設定「禁止下載」，並僅限特定部門或人員「線上播放」。\n● 如果將錄音檔轉為文字稿(逐字稿)，該文件本身也需要加密才得傳遞。"
  },
  {
    "id": "RULE-PDF-007",
    "assetType": "實體圖紙本",
    "description": "以紙張列印之視覺設計、工業設計(如外觀、機構、工藝圖、手繪草圖、工程圖)。",
    "digitalManagement": "如需存取為數位檔案(CAD/PDF等)，請詳閱[設計數位圖檔案]規則。",
    "physicalManagement": "1. 個人紙本應妥善存放。\n2. 須加註「版本編號/繪圖人/檔案編號/日期」。\n3. taskforce提案review的圖紙應由專案負責人收納於指定的儲存空間。\n4. 機密圖紙應該定期銷毀。",
    "accessRights": "● 由專案設計師保管，僅限專案內部相關之設計、研發成員、專案負責人與專案主管使用\n● 專案負責人須控管及調度",
    "externalCommunication": "● 內容於專案外部使用前須經專案主管核准\n● 若交付於外部廠商，需加上*浮水印並於圖面上標註發行人/專案負責人相關資訊\n● 僅限在辦公室內的指定空間流通，不得掃描轉寄或任意攜出公司。\n● 因差旅、公出或居家工作需要攜出，必須先取得專案主管的授權。\n● 紙本上需加註「僅限內部使用」字樣。"
  },
  {
    "id": "RULE-PDF-008",
    "assetType": "設計數位圖檔案",
    "description": "由設計與研發產出之數位檔案。包含但不僅限於設計圖(.jpg/.png/.psd/.ai/.dwg/.dxf/.pdf)、3D圖檔(.prt/.asm/.stp/.igs/.obj/.3dm/.ks/.c4d/.3ds/.max)、外觀結構組立圖(含裝配資訊)、模具開發參考圖(DFM檔案)。",
    "digitalManagement": "1. 應妥善儲存於限定位置(OA、個人掛帳裝置、公司雲端、ADC server)。個人掛帳裝置歸還前須把檔案清空。\n2. 禁止存於個人雲端、USB隨身碟、SSD等私人存儲裝置。",
    "physicalManagement": "",
    "accessRights": "● 由專案設計師保管，僅限專案內部相關之設計、研發成員、專案負責人與專案主管使用\n● 專案負責人須控管及調度",
    "externalCommunication": "● 內容於專案外部使用前須經專案主管核准\n● 外部廠商須具有華碩NDA授權方可使用\n● 對外提供優先使用STEP或PDF等「去參數化」通用格式，避免直接提供可編輯原始檔。\n● 提供檔案給外部廠商前，必須取得專案主管核可，並確認已簽署NDA。\n● 匯出的文件檔(含PDF/圖片等)須加上*浮水印。"
  },
  {
    "id": "RULE-PDF-009",
    "assetType": "實體模型樣品(如Mockup/快速打樣品/3D列印)",
    "description": "用於概念驗證、外觀確認、使用測試之實體模型樣品。包含但不僅限ID Foam Mockup(外觀用、手感打樣)、快速3D列印樣品、半功能樣機(Prototype)、包裝盒樣板(紙模、瓦楞紙版型)、外觀草模、精模。",
    "digitalManagement": "1. 拍照需在半天內上傳至指定檔案區，並從拍照裝置中刪除。\n2. 若有實驗報告或數據，應妥善儲存於限定位置(OA、個人掛帳裝置、公司雲端、ADC server)。",
    "physicalManagement": "1. 樣品需貼上*標籤(負責人/專案名稱/製作日期/階段)。\n2. 專案負責人應該妥善保管或存放於樣品櫃或部門指定儲位。\n3. 有需求外借(展示、討論)應明確登記，任務完成後應由專案負責人妥善回收保管。\n4. 專案負責人應定期清點經專案主管同意後可按規範*報廢。",
    "accessRights": "● 由專案設計師保管，僅限專案內部相關之設計、研發成員、專案負責人與專案主管使用\n● 專案負責人須控管及調度",
    "externalCommunication": "● 內容於專案外部使用前須經專案主管核准\n● 外部廠商須具有華碩NDA授權方可使用\n● 因公務需求攜出或寄送至外部時，必須取得專案主管同意，並使用不透明、防撞的箱體妥善包裝。\n● 模型本體或其包裝箱上，應清楚標示「*機密資產禁止拍照」等警示字樣。\n● 傳遞時專案設計師需確實做到出借與歸還紀錄。\n● 與外部廠商討論用，必須取得專案主管核可，並確認已簽署NDA。"
  },
  {
    "id": "RULE-PDF-010",
    "assetType": "研發樣品(如:CMF樣品/打樣件/實驗材料)",
    "description": "開發過程中實際取得或測試的材質與功能樣本。包含但不僅限材料打樣板(如金屬陽極色板、塑膠咬花樣板)、試產樣、色板(噴塗/IMR等)、PCB或內部零件測試樣、特規材料(mylar、特規玻璃、雷雕效果樣本)、rubber/鍵盤/螺絲/轉軸/五金件打樣等。",
    "digitalManagement": "1. 拍照需在半天內上傳至指定檔案區，並從拍照裝置中刪除。\n2. 若有實驗報告或數據，應妥善儲存於限定位置(OA、個人掛帳裝置、公司雲端、ADC server)。",
    "physicalManagement": "1. 樣品需貼上*標籤(負責人/專案名稱/製作日期/階段)。\n2. 專案負責人應該妥善保管或收納於指定的儲存空間。\n3. 有需求外借(展示、討論)應明確登記，任務完成後應由專案負責人妥善回收保管。\n4. 專案負責人應定期清點經專案主管同意後可按規範*報廢。",
    "accessRights": "● 由專案設計師保管，僅限專案內部相關之設計、研發成員、專案負責人與專案主管使用\n● 專案負責人須控管及調度",
    "externalCommunication": "● 內容於專案外部使用前須經專案主管核准\n● 外部廠商須具有華碩NDA授權方可使用\n● 廢棄時須依*公司機密廢棄物原則處理。徹底破壞至無法辨識其\n● 樣品本體應使用*代號或序號標示，避免直接標示產品名稱或敏感技術規格。\n● 任何形式的攜出或寄送，皆須經由專案主管核可，並建立完整的點交紀錄鏈。\n● 傳遞時專案設計師需確實做到出借與歸還紀錄。\n● 與外部廠商討論用，必須取得專案主管核可，並確認已簽署NDA。"
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

const RuleCard: React.FC<{ rule: Rule }> = ({ rule }) => (
  <div className="rule-card">
    <h3>{rule.assetType}</h3>
    <p><span className="label">說明:</span> {rule.description}</p>
    <p><span className="label">數位檔案儲存與管理:</span></p>
    <ul>
      {rule.digitalManagement.split('\n').map((item, index) => (
        item.trim() !== '' && <li key={index}>{item.trim()}</li>
      ))}
    </ul>
    <p><span className="label">實體檔案儲存與管理:</span></p>
    <ul>
      {rule.physicalManagement.split('\n').map((item, index) => (
        item.trim() !== '' && <li key={index}>{item.trim()}</li>
      ))}
    </ul>
    <p><span className="label">存取權限:</span></p>
    <ul>
      {rule.accessRights.split('\n').map((item, index) => (
        item.trim() !== '' && <li key={index}>{item.trim()}</li>
      ))}
    </ul>
    <p><span className="label">對外溝通原則:</span></p>
    <ul>
      {rule.externalCommunication.split('\n').map((item, index) => (
        item.trim() !== '' && <li key={index}>{item.trim()}</li>
      ))}
    </ul>
  </div>
);

function App() {
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>設計中心通則資安管理辦法</h1>
      </header>
      <main>
        <div className="controls">
          <input
            type="text"
            placeholder="搜尋關鍵字..."
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
