"use client";

import { FormEvent, useEffect, useState } from "react";

const winningPrize = "VOUCHER KINH MAT 100$";
const generateVoucherCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)],
  ).join("");
};

const normalizeUsername = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();

const winningUsernames = new Set(
  [
    "Công Dương",
    "Con thỏ màu đỏ",
    "Công tử xóm núi",
    "Chim sẻ",
    "Người tình không bao giờ cưới",
  ].map(normalizeUsername),
);

const fakeWinners = [
  "Linh vua nhan voucher 100$",
  "Minh vua mo trung voucher 100$",
  "Huyen da nhan voucher 100$",
  "Tuan vua trung voucher 100$",
  "Ngoc vua nhan voucher 100$",
  "Phuong da mo trung voucher 100$",
];

type GameState = "idle" | "opening" | "win" | "lose";

export default function Home() {
  const [username, setUsername] = useState("");
  const [gameState, setGameState] = useState<GameState>("idle");
  const [coupon, setCoupon] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(0);

  useEffect(() => {
    const ticker = window.setInterval(() => {
      setWinnerIndex((currentIndex) => (currentIndex + 1) % fakeWinners.length);
    }, 2600);

    return () => window.clearInterval(ticker);
  }, []);

  useEffect(() => {
    if (gameState !== "opening") {
      return;
    }

    const timer = window.setTimeout(() => {
      const normalizedUsername = normalizeUsername(username);
      const didWin = winningUsernames.has(normalizedUsername);

      if (didWin) {
        setCoupon(winningPrize);
        setVoucherCode(generateVoucherCode());
        setGameState("win");
        setShowResultPopup(true);
        return;
      }

      setCoupon("");
      setVoucherCode("");
      setGameState("lose");
      setShowResultPopup(true);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [gameState, username]);

  const handleOpenGift = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || gameState === "opening") {
      return;
    }

    setCoupon("");
    setVoucherCode("");
    setShowResultPopup(false);
    setGameState("opening");
  };

  const resetGame = () => {
    setGameState("idle");
    setCoupon("");
    setVoucherCode("");
    setShowResultPopup(false);
  };

  const closePopup = () => {
    setShowResultPopup(false);
  };

  const isWin = gameState === "win";
  const isLose = gameState === "lose";
  const isOpening = gameState === "opening";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(104,255,71,0.16),_transparent_34%),linear-gradient(180deg,_#050505_0%,_#071109_52%,_#030303_100%)] px-4 py-8 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#214d22_0.9px,transparent_0.9px)] [background-size:18px_18px] opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle,_rgba(95,255,73,0.16),_transparent_68%)]" />

      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center">
        <div className="w-full rounded-[32px] border border-[#2f4f31] bg-[#090909]/95 p-5 shadow-[0_0_0_1px_rgba(113,255,73,0.08),0_20px_80px_rgba(0,0,0,0.6),0_0_40px_rgba(84,255,42,0.14)] backdrop-blur">
          <div className="mb-4 overflow-hidden rounded-2xl border border-[#29412a] bg-[#101010] px-3 py-3">
            <div
              key={winnerIndex}
              className="winner-ticker flex items-center gap-3 text-sm text-[#d9d9d9]"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#61ff3b] font-black text-black">
                !
              </span>
              <p>
                <span className="font-mono uppercase tracking-[0.18em] text-[#75ff4f]">
                  Live Reward
                </span>
                <span className="ml-2">{fakeWinners[winnerIndex]}</span>
              </p>
            </div>
          </div>

          <div className="mb-5 flex items-center justify-between border-b border-[#1d381c] pb-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#75ff4f]">
                Lucky Game
              </p>
              <h1 className="mt-2 text-4xl font-black uppercase leading-none tracking-tight text-white">
                Gift
                <span className="ml-2 text-[#75ff4f]">Drop</span>
              </h1>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[#315a30] bg-[#101010] shadow-[0_0_18px_rgba(117,255,79,0.12)]">
              <span className="text-2xl text-[#75ff4f]">*</span>
            </div>
          </div>

          <p className="mb-6 text-center text-sm leading-7 text-[#9ba39b]">
            Nhập tên của bạn để mở hộp quà may mắn. Nếu đúng tên trúng thưởng,
            bạn sẽ nhận voucher kính mắt 100 đô ngay trên màn hình.
          </p>

          <form
            onSubmit={handleOpenGift}
            className="rounded-[24px] border border-[#1f341d] bg-[linear-gradient(180deg,_rgba(18,18,18,0.98),_rgba(8,8,8,0.98))] p-4 shadow-[inset_0_0_30px_rgba(113,255,73,0.06)]"
          >
            <label
              htmlFor="username"
              className="mb-2 block font-mono text-[11px] uppercase tracking-[0.35em] text-[#75ff4f]"
            >
              Username
            </label>
            <input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Nhập tên của bạn"
              className="w-full border border-[#253926] bg-[#202020] px-4 py-4 text-base text-white outline-none transition focus:border-[#75ff4f] focus:shadow-[0_0_0_3px_rgba(117,255,79,0.12)]"
            />
            <button
              type="submit"
              disabled={isOpening || !username.trim()}
              className="mt-4 w-full bg-[#61ff3b] px-4 py-4 text-sm font-black uppercase tracking-[0.25em] text-black transition hover:bg-[#87ff6c] disabled:cursor-not-allowed disabled:bg-[#355a2d] disabled:text-[#a4b3a1]"
            >
              {isOpening ? "Scanning Loot..." : "Open Box"}
            </button>
          </form>

          <div className="relative mt-8 overflow-hidden rounded-[28px] border border-[#3a2a2a] bg-[radial-gradient(circle_at_top,_rgba(255,67,67,0.16),_transparent_35%),linear-gradient(180deg,_#110a0a_0%,_#0c0c0c_100%)] px-6 py-8">
            <div className="absolute left-4 top-4 h-8 w-12 border-l-4 border-t-4 border-[#73ff52]" />
            <div className="absolute bottom-4 right-4 h-8 w-12 border-b-4 border-r-4 border-[#73ff52]" />

            {isOpening && (
              <div className="gift-particles" aria-hidden="true">
                <span className="gift-particle gift-particle--1" />
                <span className="gift-particle gift-particle--2" />
                <span className="gift-particle gift-particle--3" />
                <span className="gift-particle gift-particle--4" />
                <span className="gift-particle gift-particle--5" />
                <span className="gift-particle gift-particle--6" />
              </div>
            )}

            <div
              className={`gift-box mx-auto ${isOpening ? "gift-box--floating" : ""} ${isWin ? "gift-box--open gift-box--win" : ""} ${isLose ? "gift-box--lose" : ""} ${isOpening || isWin ? "gift-box--energized" : ""}`}
            >
              <div className="gift-box__lid" />
              <div className="gift-box__body" />
              <div className="gift-box__ribbon gift-box__ribbon--vertical" />
              <div className="gift-box__ribbon gift-box__ribbon--horizontal" />
            </div>

            <div
              className={`mt-8 text-center ${isOpening ? "gift-panel--shake" : ""}`}
            >
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#75ff4f]">
                {isWin
                  ? "Mission Accomplished"
                  : isOpening
                    ? "Loot Sequence"
                    : isLose
                      ? "Try Again"
                      : "Mystery Reward"}
              </p>

              {gameState === "idle" && (
                <>
                  <h2 className="mt-3 text-3xl font-black uppercase text-white">
                    Sẵn sàng
                    <span className="ml-2 text-[#75ff4f]">mở quà?</span>
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#a9a9a9]">
                    Hộp quà đỏ đang chờ bạn. Điền tên và bấm mở để thử vận may.
                  </p>
                </>
              )}

              {isOpening && (
                <>
                  <h2 className="mt-3 text-4xl font-black uppercase text-white">
                    Hộp quà đang
                    <span className="ml-2 text-[#75ff4f]">kích hoạt</span>
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#d0d0d0]">
                    Hệ thống đang cho hộp quà bay lên, xoay kiểm tra và chuẩn bị
                    công bố kết quả cho {username}.
                  </p>
                </>
              )}

              {!showResultPopup && isWin && (
                <>
                  <h2 className="mt-3 text-5xl font-black uppercase italic leading-none text-[#75ff4f]">
                    Bạn thắng!
                  </h2>
                  <div className="mx-auto mt-4 max-w-[220px] rounded-xl border border-[#53754a] bg-[#262626] px-4 py-5 shadow-[0_0_30px_rgba(117,255,79,0.12)]">
                    <p className="text-4xl font-black uppercase text-[#75ff4f]">
                      {coupon}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.28em] text-[#b6b6b6]">
                      Voucher kính mắt cho {username}
                    </p>
                    <p className="mt-3 font-mono text-sm uppercase tracking-[0.32em] text-white">
                      {voucherCode}
                    </p>
                  </div>
                </>
              )}

              {!showResultPopup && isLose && (
                <>
                  <h2 className="mt-3 text-4xl font-black uppercase text-white">
                    Chưa trúng
                    <span className="ml-2 text-[#75ff4f]">rồi</span>
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#d0d0d0]">
                    Chúc bạn may mắn lần sau, {username}. Hãy thử lại để săn
                    phần thưởng tiếp theo.
                  </p>
                </>
              )}

              {gameState !== "idle" && !showResultPopup && (
                <button
                  type="button"
                  onClick={resetGame}
                  className="mt-6 w-full bg-[#61ff3b] px-4 py-4 text-sm font-black uppercase tracking-[0.22em] text-black transition hover:bg-[#87ff6c]"
                >
                  {isWin ? "Claim Your Coupon" : "Open Another Box"}
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 font-mono text-[11px] uppercase tracking-[0.24em]">
            <div className="border border-[#29402a] bg-[#121212] px-3 py-3 text-center text-[#75ff4f]">
              Rare Drop: 50%
            </div>
            <div className="border border-[#4f2b2b] bg-[#151010] px-3 py-3 text-center text-[#ff7f7f]">
              Gift Box: Red
            </div>
          </div>
        </div>
      </section>

      {showResultPopup && (
        <div className="result-popup-backdrop" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="result-popup-title"
            className={`result-popup ${isWin ? "result-popup--win" : "result-popup--lose"}`}
          >
            <button
              type="button"
              onClick={closePopup}
              className="result-popup__close"
              aria-label="Dong popup"
            >
              x
            </button>

            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#75ff4f]">
              {isWin ? "Reward Unlocked" : "Mission Failed"}
            </p>

            <h2
              id="result-popup-title"
              className={`mt-3 text-4xl font-black uppercase leading-none ${isWin ? "text-[#75ff4f]" : "text-white"}`}
            >
              {isWin ? "Bạn đã trúng!" : "May mắn lần sau"}
            </h2>

            {isWin ? (
              <>
                <div className="result-popup__coupon">
                  <span>{coupon}</span>
                </div>
                <p className="mt-4 text-center font-mono text-base uppercase tracking-[0.42em] text-white">
                  {voucherCode}
                </p>
                <p className="mt-4 text-sm leading-7 text-[#d3d3d3]">
                  Chúc mừng {username}, bạn đã nhận được voucher kính mắt 100 đô.
                </p>
              </>
            ) : (
              <p className="mt-5 text-sm leading-7 text-[#d3d3d3]">
                {username} chưa nằm trong danh sách trúng thưởng. Chúc bạn may
                mắn lần sau.
              </p>
            )}

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={resetGame}
                className="w-full bg-[#61ff3b] px-4 py-4 text-sm font-black uppercase tracking-[0.22em] text-black transition hover:bg-[#87ff6c]"
              >
                {isWin ? "Nhan Voucher" : "Thu Lai"}
              </button>
              <button
                type="button"
                onClick={closePopup}
                className="w-full border border-[#284028] bg-[#101010] px-4 py-4 text-sm font-black uppercase tracking-[0.22em] text-[#d7d7d7] transition hover:border-[#75ff4f]"
              >
                Dong
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
