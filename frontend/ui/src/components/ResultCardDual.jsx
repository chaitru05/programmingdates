import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import CompatibilityMeter from './CompatibilityMeter.jsx';

export default function ResultCardDual({
  plan,
  person1Name,
  person2Name,
  compatibility,
  onShare,
}) {
  const cardRef = useRef(null);

  const downloadPDF = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

      const p1 = (person1Name || 'Person1').replace(/\s+/g, '_');
      const p2 = (person2Name || 'Person2').replace(/\s+/g, '_');

      pdf.save(`Perfect_Date_${p1}_${p2}.pdf`);
    } catch (err) {
      console.error('PDF download failed', err);
      alert('Failed to download PDF. Please try again or take a screenshot.');
    }
  };

  if (!plan) return null;

  const {
    romanticTitle,
    personalMessage,
    venueType,
    activities,
    budgetBreakdown,
    timeline,
    surpriseMoment
  } = plan;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8 md:p-12 bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
      <div className="w-full max-w-5xl space-y-8">

        {/* Compatibility Section */}
        {compatibility && (
          <div className="transform hover:scale-[1.01] transition duration-300">
            <CompatibilityMeter
              percentage={compatibility.percentage}
              coupleType={compatibility.coupleType}
            />
          </div>
        )}

        {/* Main Result Card */}
        <div
          ref={cardRef}
          className="rounded-3xl p-10 bg-white/85 backdrop-blur-xl border border-rose-200 shadow-2xl text-rose-950"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 border-b border-rose-200 pb-5">
            <span className="text-5xl">❤️</span>
            <div>
              <h2
                className="text-3xl font-bold text-rose-800"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Your Perfect Date Plan
              </h2>
              {romanticTitle && (
                <p className="text-lg font-medium text-rose-600 mt-1">
                  {romanticTitle}
                </p>
              )}
            </div>
          </div>

          {/* Personal Message */}
          {personalMessage && (
            <p className="mb-8 italic text-rose-900/80 text-lg leading-relaxed">
              {personalMessage}
            </p>
          )}

          {/* Venue */}
          {venueType && (
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-wider text-rose-700 mb-2">
                Venue
              </p>
              <p className="font-semibold text-xl text-rose-950">
                {venueType}
              </p>
            </div>
          )}

          {/* Activities */}
          {activities?.length > 0 && (
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-wider text-rose-700 mb-3">
                Activities
              </p>
              <ul className="list-disc list-inside space-y-2 text-rose-900/90">
                {activities.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Budget */}
          {budgetBreakdown?.total != null && (
            <div className="mb-8 p-6 rounded-2xl bg-rose-50 border border-rose-200">
              <p className="text-sm font-bold uppercase tracking-wider text-rose-700 mb-3">
                Budget Breakdown
              </p>

              <div className="grid sm:grid-cols-3 gap-4 text-sm text-rose-900/90 mb-4">
                <p>Dinner: ₹{budgetBreakdown.dinner ?? 0}</p>
                <p>Activities: ₹{budgetBreakdown.activities ?? 0}</p>
                <p>Travel: ₹{budgetBreakdown.travel ?? 0}</p>
              </div>

              <p className="font-bold text-rose-700 text-lg border-t border-rose-200 pt-3">
                Total: ₹{budgetBreakdown.total}
              </p>
            </div>
          )}

          {/* Timeline */}
          {timeline?.length > 0 && (
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-wider text-rose-700 mb-4">
                Timeline
              </p>

              <ul className="space-y-4 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-rose-200 rounded-full"></div>

                {timeline.map((item, i) => (
                  <li key={i} className="flex gap-5 relative z-10">
                    <div className="w-4 h-4 bg-rose-400 rounded-full border-2 border-white mt-1 shrink-0 shadow-sm" />
                    <div>
                      <span className="font-bold text-rose-600 block text-sm">
                        {item.time}
                      </span>
                      <span className="text-rose-950">
                        {item.event}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Surprise */}
          {surpriseMoment && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200">
              <p className="text-sm font-bold text-rose-600 mb-2">
                ✨ Surprise Moment
              </p>
              <p className="text-rose-900 text-sm leading-relaxed">
                {surpriseMoment}
              </p>
            </div>
          )}
        </div>

        {/* Download Button */}
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={onShare}
            className="px-10 py-4 rounded-2xl bg-white border-2 border-rose-400 text-rose-600 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition duration-200"
          >
            🔗 Share Link
          </button>
          <button
            type="button"
            onClick={downloadPDF}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition duration-200"
          >
            📄 Download PDF
          </button>
        </div>

      </div>
    </div>
  );
}
