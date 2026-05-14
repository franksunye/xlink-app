/** 与概念版 `pages/login/index.vue` 工人场景块结构一致（rpx→近似 px）。 */
export function LoginWorkerScene() {
  return (
    <div
      className="relative mx-auto mt-10 w-[260px] overflow-hidden rounded-t-3xl bg-gradient-to-b from-[#f8fbff] via-[#eef5ff] to-[#e9f1ff]"
      style={{ height: 172 }}
    >
      <div className="pointer-events-none absolute bottom-[52px] left-[18px] h-[59px] w-[39px] bg-[#d8e7fb]" />
      <div className="pointer-events-none absolute bottom-[42px] left-[29px] h-[77px] w-[49px] bg-[#c8dcf9]" />
      <div className="pointer-events-none absolute bottom-[48px] right-[39px] h-[66px] w-[44px] bg-[#d8e7fb]" />
      <div className="pointer-events-none absolute bottom-[34px] right-[17px] h-[94px] w-[55px] bg-[#c2d8f7]" />
      <div className="pointer-events-none absolute bottom-[54px] left-[65px] h-1.5 w-[135px] rotate-[-10deg] rounded-full bg-[#9fc9ff]" />
      <div className="pointer-events-none absolute bottom-[46px] left-[58px] h-1 w-[116px] rotate-[-8deg] rounded-full bg-[#c8ddff]" />
      <div className="pointer-events-none absolute bottom-5 left-[25px] h-6 w-8 bg-[#afcdf2]" />
      <div className="pointer-events-none absolute bottom-5 right-[19px] h-6 w-8 bg-[#afcdf2]" />
      <div className="pointer-events-none absolute bottom-[11px] left-[110px] h-3.5 w-[85px] rounded-full bg-[rgba(162,190,227,0.36)]" />
      <div className="pointer-events-none absolute bottom-10 left-[126px] h-[110px] w-[63px]">
        <div className="absolute left-[15px] top-0 h-[18px] w-9 rounded-t-[35px] bg-[#ffc500]" />
        <div className="absolute left-[22px] top-[14px] h-5 w-5 rounded-full bg-[#ffd2ae]" />
        <div className="absolute left-[15px] top-[33px] h-12 w-[35px] rounded-[9px] bg-[#1f77f0]" />
        <div className="absolute left-[27px] top-[34px] h-[23px] w-[11px] bg-[#f7fbff]" style={{ clipPath: "polygon(0 0,100% 0,66% 100%,34% 100%)" }} />
        <div className="absolute left-1.5 top-9 h-[37px] w-[11px] rotate-[34deg] rounded-[7px] bg-[#155fca]" />
        <div className="absolute right-1 top-9 h-[37px] w-[11px] rotate-[-34deg] rounded-[7px] bg-[#155fca]" />
        <div className="absolute bottom-5 left-[22px] h-[41px] w-1.5 bg-[#1f77f0]" />
        <div className="absolute bottom-5 right-[17px] h-[41px] w-1.5 bg-[#1f77f0]" />
        <div className="absolute bottom-4 left-4 h-2 w-5 rounded-md bg-[#173f79]" />
        <div className="absolute bottom-4 right-2.5 h-2 w-5 rounded-md bg-[#173f79]" />
      </div>
    </div>
  );
}

export function LoginBrandMark() {
  return (
    <div className="relative h-14 w-[4.25rem] shrink-0">
      <span className="absolute left-1 top-1 h-11 w-11 rounded-full bg-[#ffca1b]" />
      <span
        className="absolute left-5 top-8 h-5 w-10 border-b-[10px] border-l-[10px] border-[#1f77f0]"
        style={{ transform: "rotate(-45deg)" }}
        aria-hidden
      />
      <span className="absolute bottom-3 right-0.5 h-3 w-3 rotate-45 bg-[#0a46a8]" aria-hidden />
    </div>
  );
}
