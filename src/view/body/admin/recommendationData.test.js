import {
  extractCounselorID,
  extractEmbeddedCounselor,
  getCounselorDetail,
  normalizeRecommendations,
  resolveCounselor,
  toRecommendationArray,
  toRecommendationPayload,
} from "./recommendationData";

const counselor = {
  ID: "c-1",
  UserName: { NickName: "小明老師", Name: { LastName: "王", FirstName: "小明" } },
  Photo: "https://example.com/1.png",
  Position: "臨床心理師",
  Location: "台北",
  Email: "ming@example.com",
  Phone: "0912345678",
  Languages: ["中文", "英文"],
  Expertises: [{ Skill: "焦慮" }, { Skill: "失眠" }, { Skill: "焦慮" }],
  IsVerify: true,
  SubRole: "諮商師",
};

const counselorMap = new Map([[counselor.ID, counselor]]);

describe("toRecommendationArray", () => {
  test("接受純陣列", () => {
    expect(toRecommendationArray([{ CounselorID: "a" }])).toHaveLength(1);
  });

  test("接受被包起來的 response", () => {
    expect(toRecommendationArray({ Recommendations: [{ CounselorID: "a" }] })).toHaveLength(1);
    expect(toRecommendationArray({ Data: [{ CounselorID: "a" }] })).toHaveLength(1);
  });

  test("null / 非預期型別回空陣列而不是丟例外", () => {
    expect(toRecommendationArray(null)).toEqual([]);
    expect(toRecommendationArray(undefined)).toEqual([]);
    expect(toRecommendationArray("nope")).toEqual([]);
    expect(toRecommendationArray({ Message: "error" })).toEqual([]);
  });
});

describe("normalizeRecommendations", () => {
  test("舊的扁平格式", () => {
    const result = normalizeRecommendations([
      { CounselorID: "c-2", Sequence: 1 },
      { CounselorID: "c-1", Sequence: 0 },
    ]);
    expect(result.map((r) => r.CounselorID)).toEqual(["c-1", "c-2"]);
    expect(result[0].Counselor).toBeNull();
  });

  test("巢狀 embed：ID 與資料都取得到", () => {
    const result = normalizeRecommendations([
      { CounselorID: "c-1", Sequence: 0, Counselor: counselor },
    ]);
    expect(result[0].CounselorID).toBe("c-1");
    expect(result[0].Counselor).toBe(counselor);
  });

  test("巢狀 embed 但沒有 CounselorID 時，改用 Counselor.ID", () => {
    const result = normalizeRecommendations([{ Sequence: 0, Counselor: counselor }]);
    expect(result[0].CounselorID).toBe("c-1");
  });

  test("攤平 embed：整個物件就是諮商師", () => {
    const result = normalizeRecommendations([{ ...counselor, Sequence: 0 }]);
    expect(result[0].CounselorID).toBe("c-1");
    expect(result[0].Counselor.Position).toBe("臨床心理師");
  });

  test("推薦紀錄自己的 ID 不會被誤認為 CounselorID", () => {
    const result = normalizeRecommendations([
      { ID: "rec-row-99", CounselorID: "c-1", Sequence: 0 },
    ]);
    expect(result[0].CounselorID).toBe("c-1");
  });

  test("沒有帶諮商師欄位時，ID 不會被當成 CounselorID", () => {
    const result = normalizeRecommendations([{ ID: "rec-row-99", Sequence: 0 }]);
    expect(result[0].CounselorID).toBe("");
  });

  test("Sequence 缺漏或型別錯誤時退回索引順序", () => {
    const result = normalizeRecommendations([
      { CounselorID: "a" },
      { CounselorID: "b", Sequence: "1" },
    ]);
    expect(result.map((r) => r.Sequence)).toEqual([0, 1]);
  });

  test("接受 Order 之類的別名", () => {
    const result = normalizeRecommendations([
      { CounselorID: "a", Order: 5 },
      { CounselorID: "b", Order: 2 },
    ]);
    expect(result.map((r) => r.CounselorID)).toEqual(["b", "a"]);
  });

  test("被包起來的 response 也能正規化", () => {
    const result = normalizeRecommendations({
      Recommendations: [{ CounselorID: "c-1", Sequence: 0, Counselor: counselor }],
    });
    expect(result[0].CounselorID).toBe("c-1");
  });

  test("空值不會炸掉", () => {
    expect(normalizeRecommendations(null)).toEqual([]);
    expect(normalizeRecommendations([])).toEqual([]);
  });
});

describe("resolveCounselor", () => {
  test("優先使用本地諮商師清單（欄位最完整）", () => {
    const record = { CounselorID: "c-1", Counselor: { ID: "c-1", UserName: { NickName: "精簡" } } };
    expect(resolveCounselor(record, counselorMap)).toBe(counselor);
  });

  test("本地查不到時退回後端 embed 的資料", () => {
    const embedded = { ID: "c-9", UserName: { NickName: "只有 APP 拿得到" } };
    const record = { CounselorID: "c-9", Counselor: embedded };
    expect(resolveCounselor(record, counselorMap)).toBe(embedded);
  });

  test("兩邊都沒有就回 null", () => {
    expect(resolveCounselor({ CounselorID: "c-9", Counselor: null }, counselorMap)).toBeNull();
  });
});

describe("getCounselorDetail", () => {
  test("攤平出畫面要的欄位，專長去重", () => {
    const detail = getCounselorDetail(counselor);
    expect(detail.name).toBe("小明老師");
    expect(detail.fullName).toBe("王小明");
    expect(detail.expertises).toEqual(["焦慮", "失眠"]);
    expect(detail.isVerify).toBe(true);
  });

  test("專長是字串陣列時也吃得下", () => {
    expect(getCounselorDetail({ Expertises: ["焦慮"] }).expertises).toEqual(["焦慮"]);
  });

  test("欄位缺漏時回安全的預設值", () => {
    const detail = getCounselorDetail({});
    expect(detail.name).toBe("未命名");
    expect(detail.expertises).toEqual([]);
    expect(detail.languages).toEqual([]);
    expect(detail.isVerify).toBe(false);
  });
});

describe("toRecommendationPayload", () => {
  test("不論 response 是哪種形態，寫回都只送 CounselorID 與 Sequence", () => {
    const normalized = normalizeRecommendations([{ ...counselor, Sequence: 0 }]);
    expect(toRecommendationPayload(normalized)).toEqual([{ CounselorID: "c-1", Sequence: 0 }]);
  });
});

describe("extract helpers", () => {
  test("extractCounselorID / extractEmbeddedCounselor 對非物件輸入是安全的", () => {
    expect(extractCounselorID(null)).toBe("");
    expect(extractCounselorID("x")).toBe("");
    expect(extractEmbeddedCounselor(null)).toBeNull();
    expect(extractEmbeddedCounselor(42)).toBeNull();
  });
});
