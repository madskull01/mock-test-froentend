import {
  ArrowRight,
  Check,
  CreditCard,
  LoaderCircle,
  LockKeyhole,
  Target,
} from "lucide-react";
import { formatDate } from "../../utils/viewHelpers";

export function PricingPlans({
  onBuyPackage,
  paymentNotice,
  activePaymentPackage,
}) {
  const plans = [
    {
      id: "SECTION_A",
      title: "Section A",
      price: 299,
      description: "Focused access for Section A.",
      included: ["Section A tests", "One-time payment", "Secure checkout"],
    },
    {
      id: "SECTION_A_B",
      title: "Section A + B",
      price: 499,
      description: "Two sections in one package.",
      included: ["Section A tests", "Section B tests", "One-time payment"],
      featured: true,
    },
    {
      id: "SECTION_A_B_C",
      title: "Section A + B + C",
      price: 799,
      description: "Full access across all three sections.",
      included: ["Section A tests", "Section B tests", "Section C tests"],
    },
  ];

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-[620px] text-center">
        <p className="text-[10px] font-bold uppercase tracking-[1.8px] text-[#82906f]">
          One-time packages
        </p>
        <h1 className="mt-2 font-display text-[28px] font-extrabold tracking-[-1px] sm:text-[34px]">
          Choose your section access.
        </h1>
        <p className="mt-3 text-[12px] leading-6 text-[#7b887f]">
          Secure checkout with Razorpay. Access is activated only after payment
          is verified by our server.
        </p>
      </div>
      {paymentNotice && (
        <div
          className={`mx-auto mt-6 max-w-[760px] rounded-xl border px-4 py-3 text-[12px] ${paymentNotice.type === "success" ? "border-[#c6d9b7] bg-[#f1f7e9] text-[#426c35]" : paymentNotice.type === "error" ? "border-[#f1c4b8] bg-[#fff3ee] text-[#994a36]" : "border-[#e5ddbd] bg-[#fff9e8] text-[#79652e]"}`}
          role={paymentNotice.type === "error" ? "alert" : "status"}
        >
          {paymentNotice.message}
        </div>
      )}
      <div className="mt-9 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={`relative flex flex-col rounded-2xl border bg-white p-5 sm:p-6 ${plan.featured ? "border-[#899d56] shadow-xl shadow-[#17221f]/[0.07] md:-translate-y-2" : "border-[#e5eae2]"}`}
          >
            {plan.featured && (
              <span className="absolute right-4 top-4 rounded-full bg-[#eff4e8] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.9px] text-[#61764a]">
                Popular
              </span>
            )}
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eff4e8] text-[#718a42]">
              <CreditCard size={18} />
            </span>
            <h2 className="mt-4 font-display text-[17px] font-extrabold text-[#26352d]">
              {plan.title}
            </h2>
            <p className="mt-1 min-h-10 text-[11px] leading-5 text-[#89948c]">
              {plan.description}
            </p>
            <p className="mt-4 flex items-baseline gap-1.5 text-[#17221f]">
              <span className="text-[17px] font-bold">₹</span>
              <span className="font-display text-[39px] font-extrabold tracking-[-1.8px]">
                {plan.price}
              </span>
              <span className="text-[10px] font-semibold text-[#89948c]">
                one-time
              </span>
            </p>
            <ul className="mt-4 space-y-2.5 border-t border-[#edf0eb] pt-4">
              {plan.included.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-[11px] font-medium text-[#68766e]"
                >
                  <Check size={14} className="shrink-0 text-[#718a42]" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onBuyPackage(plan.id)}
              disabled={activePaymentPackage === plan.id}
              className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-[11px] font-bold transition disabled:cursor-wait disabled:opacity-60 ${plan.featured ? "bg-[#17221f] text-white hover:bg-[#304238]" : "border border-[#d8dfd5] bg-white text-[#314138] hover:bg-[#f7f8f4]"}`}
            >
              {activePaymentPackage === plan.id ? (
                <>
                  <LoaderCircle size={14} className="animate-spin" />
                  Preparing checkout…
                </>
              ) : (
                <>
                  Continue to payment <ArrowRight size={14} />
                </>
              )}
            </button>
          </article>
        ))}
      </div>
      <div className="mx-auto mt-6 flex max-w-[760px] flex-col items-center justify-center gap-3 rounded-2xl border border-[#e5eae2] bg-white px-4 py-4 text-center sm:flex-row sm:gap-5 sm:text-left">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f1f4ef] text-[#61764a]">
          <LockKeyhole size={17} />
        </span>
        <div>
          <p className="text-[11px] font-extrabold text-[#26352d]">
            Secure payments powered by Razorpay
          </p>
          <p className="mt-1 text-[10px] leading-5 text-[#89948c]">
            Cards, UPI and other payment options shown in checkout depend on
            your Razorpay account configuration. Formative never receives or
            stores your card details.
          </p>
        </div>
      </div>
    </div>
  );
}

export function HistoryView({ history, hasUser, onRegister }) {
  if (!hasUser)
    return (
      <div className="mx-auto max-w-[560px] py-20 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e8eee5] text-[#69806c]">
          <Target size={23} />
        </span>
        <h1 className="mt-5 font-display text-2xl font-extrabold">
          Your results live here
        </h1>
        <p className="mt-2 text-[13px] leading-6 text-[#829087]">
          Create a student profile to save attempts and track your progress.
        </p>
        <button
          onClick={onRegister}
          className="mt-5 rounded-full bg-[#17221f] px-5 py-3 text-[12px] font-bold text-white"
        >
          Create a profile
        </button>
      </div>
    );
  return (
    <section className="mx-auto max-w-[980px] pt-4">
      <div className="mb-7">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[1.8px] text-[#98a19a]">
          A record of your work
        </p>
        <h1 className="font-display text-[30px] font-extrabold">My results</h1>
      </div>
      <div className="overflow-hidden rounded-xl border border-[#e5eae3] bg-white">
        {history.length ? (
          history.map((entry) => (
            <div
              key={entry.attemptId}
              className="flex items-center justify-between gap-4 border-b border-[#f0f2ef] px-5 py-4 last:border-0"
            >
              <div className="min-w-0">
                <p className="truncate text-[12px] font-bold text-[#26332b]">
                  {entry.testTitle}
                </p>
                <p className="mt-1 text-[10px] text-[#9aa39c]">
                  {formatDate(entry.submittedAt ?? entry.startedAt)}
                </p>
              </div>
              <span className="text-[12px] font-bold text-[#344a3b]">
                {entry.score ?? "—"}/{entry.totalMarks ?? "—"}
              </span>
              <span className="text-[12px] font-semibold text-[#68766d]">
                {entry.percentage != null
                  ? `${Math.round(entry.percentage)}%`
                  : "In progress"}
              </span>
            </div>
          ))
        ) : (
          <div className="px-5 py-14 text-center">
            <p className="font-display text-[15px] font-extrabold">
              No attempts yet
            </p>
            <p className="mt-1 text-[12px] text-[#8a958d]">
              Your completed mock tests will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
