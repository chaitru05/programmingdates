import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import CompatibilityMeter from './CompatibilityMeter.jsx';

export default function ResultCardDual({ plan, person1Name, person2Name, compatibility }) {
  const cardRef = useRef(null);

  const downloadPDF = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true, backgroundColor: null, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const p1 = (person1Name || 'Person1').replace(/\s+/g, '_');
      const p2 = (person2Name || 'Person2').replace(/\s+/g, '_');
      pdf.save(`Perfect_Date_${p1}_${p2}.pdf`);
    } catch (err) {
      console.error('PDF download failed', err);
    }
  };

  if (!plan) return null;

  const { romanticTitle, personalMessage, venueType, activities, budgetBreakdown, timeline, surpriseMoment } = plan;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {compatibility && (
        <div className="mb-6 transform hover:scale-[1.01] transition duration-300">
          <CompatibilityMeter percentage={compatibility.percentage} coupleType={compatibility.coupleType} />
        </div>
      )}
      <div
        ref={cardRef}
        className="rounded-3xl p-8 bg-white/40 backdrop-blur-md border-[3px] border-rose-200 shadow-2xl text-rose-950"
      >
        <div className="flex items-center gap-3 mb-6 border-b border-rose-200/60 pb-4">
          <span className="text-4xl filter drop-shadow-sm">❤️</span>
          <div>
            <h2 className="text-2xl font-bold text-rose-900" style={{ fontFamily: 'var(--font-heading)' }}>Your Date Plan</h2>
            {romanticTitle && <p className="text-base font-medium text-rose-600 mt-0.5">{romanticTitle}</p>}
          </div>
        </div>

        {personalMessage && <p className="mb-6 italic text-rose-900/80 text-lg leading-relaxed">{personalMessage}</p>}

        {venueType && (
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-wider text-rose-800 mb-1">Venue</p>
            <p className="font-medium text-lg text-rose-950">{venueType}</p>
          </div>
        )}

        {activities?.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-wider text-rose-800 mb-2">Activities</p>
            <ul className="list-disc list-inside space-y-1 ml-1 text-rose-900/90">
              {activities.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        )}

        {budgetBreakdown?.total != null && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-100/40 border border-rose-200">
            <p className="text-sm font-bold uppercase tracking-wider text-rose-800 mb-2">Budget</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-rose-900/90 mb-2">
              <p>Dinner: ₹{budgetBreakdown.dinner ?? 0}</p>
              <p>Activities: ₹{budgetBreakdown.activities ?? 0}</p>
              <p>Travel: ₹{budgetBreakdown.travel ?? 0}</p>
            </div>
            <p className="font-bold text-rose-700 text-lg border-t border-rose-200 pt-2 mt-1">Total: ₹{budgetBreakdown.total}</p>
          </div>
        )}

        {timeline?.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-wider text-rose-800 mb-3">Timeline</p>
            <ul className="space-y-3 relative">
              <div className="absolute left-[6.5px] top-2 bottom-2 w-0.5 bg-rose-200/60 rounded-full"></div>
              {timeline.map((item, i) => (
                <li key={i} className="flex gap-4 relative z-10">
                  <div className="w-3.5 h-3.5 bg-rose-400 rounded-full border-2 border-white mt-1 shrink-0 shadow-sm" />
                  <div>
                    <span className="font-bold text-rose-600 block text-sm">{item.time}</span>
                    <span className="text-rose-950">{item.event}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {surpriseMoment && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100">
            <p className="text-sm font-bold text-rose-600 mb-1">✨ Surprise idea</p>
            <p className="text-rose-900 text-sm leading-relaxed">{surpriseMoment}</p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={downloadPDF}
          className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-lg shadow-rose-300/40 hover:shadow-xl hover:scale-105 active:scale-95 transition"
        >
          📄 Download PDF
        </button>
      </div>
    </div>
  );
}
