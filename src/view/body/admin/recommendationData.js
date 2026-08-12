/**
 * 老師推薦（放鬆／諮商）API response 的解析工具。
 *
 * 後端為了讓前端 APP 能直接顯示老師資訊，會把諮商師資料串進推薦 response，
 * 因此同一支 API 可能回傳下列任一形態，後台三種都要吃得下：
 *
 *   1. 舊的扁平格式    [{ CounselorID, Sequence }]
 *   2. 巢狀 embed      [{ CounselorID, Sequence, Counselor: { ID, UserName, Photo, ... } }]
 *   3. 攤平 embed      [{ ID, Sequence, UserName, Photo, Expertises, ... }]
 *
 * 另外允許外層被包一層（{ Recommendations: [...] } 之類），避免後端加上分頁或
 * 統一回應格式時後台整頁掛掉。
 *
 * 寫回（PUT）的格式不受影響，仍然只送 { CounselorID, Sequence }。
 */

/* response 外層可能出現的清單欄位名 */
const LIST_KEYS = ["Recommendations", "Data", "Items", "List", "Result"];

/* 巢狀 embed 時，諮商師物件可能掛在哪個欄位 */
const EMBEDDED_KEYS = ["Counselor", "CounselorInfo", "Teacher"];

/* 只要出現其中一個欄位，就判定這個物件帶有諮商師資料 */
const COUNSELOR_FIELDS = [
  "UserName",
  "Photo",
  "Expertises",
  "Position",
  "Email",
  "Languages",
  "IsVerify",
  "SubRole",
];

const isObject = (value) => !!value && typeof value === "object";

const hasCounselorFields = (value) =>
  isObject(value) && COUNSELOR_FIELDS.some((field) => value[field] !== undefined);

const getEmbeddedNode = (item) =>
  isObject(item) ? EMBEDDED_KEYS.map((k) => item[k]).find(hasCounselorFields) : undefined;

/** response 可能是陣列，也可能被包在物件裡；一律取出陣列 */
export const toRecommendationArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (isObject(payload)) {
    const list = LIST_KEYS.map((k) => payload[k]).find(Array.isArray);
    if (list) return list;
  }
  return [];
};

/** 取出後端 embed 的諮商師資料；沒有就回 null */
export const extractEmbeddedCounselor = (item) => {
  const nested = getEmbeddedNode(item);
  if (nested) return nested;
  // 攤平格式：諮商師欄位直接長在推薦物件上
  if (hasCounselorFields(item)) return item;
  return null;
};

/**
 * 取出諮商師 ID。
 * item.ID 只在「攤平格式」時才是諮商師 ID —— 其他情況它可能是推薦紀錄自己的 ID，
 * 誤用會讓整列對不到人，所以要先確認這個物件本身帶有諮商師欄位。
 */
export const extractCounselorID = (item) => {
  if (!isObject(item)) return "";
  if (item.CounselorID) return item.CounselorID;
  const nested = getEmbeddedNode(item);
  if (nested?.ID) return nested.ID;
  if (hasCounselorFields(item) && item.ID) return item.ID;
  return "";
};

const SEQUENCE_KEYS = ["Sequence", "Order", "Seq", "SortOrder"];

const extractSequence = (item, index) => {
  if (!isObject(item)) return index;
  const found = SEQUENCE_KEYS.map((k) => item[k]).find(
    (v) => typeof v === "number" && Number.isFinite(v)
  );
  return found === undefined ? index : found;
};

/**
 * 把 API response 正規化成畫面用的推薦清單。
 * Counselor 欄位保留後端 embed 的資料，作為本地諮商師清單查不到時的備援。
 */
export const normalizeRecommendations = (payload) =>
  toRecommendationArray(payload)
    .map((item, i) => {
      const CounselorID = extractCounselorID(item);
      return {
        key: CounselorID ? `rec-${CounselorID}` : `rec-new-${i}`,
        CounselorID,
        Sequence: extractSequence(item, i),
        Counselor: extractEmbeddedCounselor(item),
      };
    })
    .sort((a, b) => a.Sequence - b.Sequence);

/**
 * 用 CounselorID 串出老師資料。
 * 後台以 getAllCounselorInfo 的完整資料為準（欄位最齊全），
 * 查不到時才退回後端 embed 的內容 —— 例如該老師已不在清單中，
 * 或後端 embed 的是給 APP 用的精簡欄位。
 */
export const resolveCounselor = (record, counselorMap) =>
  counselorMap.get(record?.CounselorID) || record?.Counselor || null;

export const getCounselorName = (counselor) => {
  const nick = counselor?.UserName?.NickName || "";
  const last = counselor?.UserName?.Name?.LastName || "";
  const first = counselor?.UserName?.Name?.FirstName || "";
  const full = (last + first).trim();
  return nick || full || "未命名";
};

export const getCounselorFullName = (counselor) => {
  const last = counselor?.UserName?.Name?.LastName || "";
  const first = counselor?.UserName?.Name?.FirstName || "";
  return (last + first).trim();
};

/** 攤平成畫面要顯示的欄位 */
export const getCounselorDetail = (counselor) => ({
  name: getCounselorName(counselor),
  fullName: getCounselorFullName(counselor),
  photo: counselor?.Photo || "",
  position: counselor?.Position || "",
  subRole: counselor?.SubRole || "",
  email: counselor?.Email || "",
  phone: counselor?.Phone || "",
  location: counselor?.Location || "",
  languages: Array.isArray(counselor?.Languages) ? counselor.Languages : [],
  expertises: [
    ...new Set(
      (Array.isArray(counselor?.Expertises) ? counselor.Expertises : [])
        .map((e) => (typeof e === "string" ? e : e?.Skill))
        .filter(Boolean)
    ),
  ],
  isVerify: !!counselor?.IsVerify,
});

/** 寫回後端的格式，與 response 形態無關 */
export const toRecommendationPayload = (recommendations) =>
  recommendations.map((r) => ({ CounselorID: r.CounselorID, Sequence: r.Sequence }));
