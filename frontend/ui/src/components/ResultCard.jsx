import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { getRandomSurprise } from '../utils/generator.js';

export default function ResultCard({ plan, formData, onSurprise }) {
  const cardRef = useRef(null);
  const partnerName = formData?.partnerName?.trim() || '';

  const downloadPDF = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const filename = partnerName ? `Perfect_Date_With_${partnerName.replace(/\s+/g, '_')}.pdf` : 'Perfect_Date_Plan.pdf';
      pdf.save(filename);
    } catch (err) {
      console.error('PDF download failed:', err);
    }
  };

  if (!plan) return null;

  const {
    romanticTitle,
    personalMessage,
    romanticMessage,
    venueType,
    locations,
    nearbyPlaces,
    activities,
    budgetBreakdown,
    timeline,
    surpriseMoment,
    tips,
    outfitSuggestion,
    backupIdea,
  } = plan;
  const message = personalMessage || romanticMessage;
  const hasLocations = Array.isArray(locations) && locations.length > 0;
  const hasDetails = (tips?.length || outfitSuggestion || backupIdea || surpriseMoment);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div
        ref={cardRef}
        className="rounded-3xl p-8 bg-white/40 backdrop-blur-md border-[3px] border-rose-200 shadow-2xl text-rose-950"
      >
        <div className="flex items-center gap-3 mb-6 border-b border-rose-200/60 pb-4">
          <span className="text-4xl filter drop-shadow-sm">❤️</span>
          <div>
            <h2 className="text-2xl font-bold text-rose-900" style={{ fontFamily: 'var(--font-heading)' }}>
              Your Date Plan
            </h2>
            {romanticTitle && (
              <p className="text-base font-medium text-rose-600 mt-0.5">{romanticTitle}</p>
            )}
          </div>
        </div>

        {message && <p className="mb-6 italic text-rose-900/80 text-lg leading-relaxed">{message}</p>}

        {/* Where to go & cost per location */}
        {hasLocations ? (
          <div className="mb-6 space-y-3">
            <p className="text-sm font-bold uppercase tracking-wider text-rose-800">Date Locations</p>
            {locations.map((loc, i) => (
              <div key={i} className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 shadow-sm">
                <p className="font-bold text-rose-950 text-lg">{loc.name}{loc.area ? ` · ${loc.area}` : ''}</p>
                {loc.description && <p className="text-sm mt-1 text-rose-900/80 leading-snug">{loc.description}</p>}
                <p className="text-sm font-bold text-rose-600 mt-2">₹{loc.estimatedCost}</p>
              </div>
            ))}
          </div>
        ) : venueType && (
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-wider text-rose-800 mb-1">Suggested Venue</p>
            <p className="font-medium text-lg text-rose-950">{venueType}</p>
          </div>
        )}

        {/* Suggested nearby places */}
        {Array.isArray(nearbyPlaces) && nearbyPlaces.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-wider text-rose-800 mb-2">Nearby Gems</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-rose-900/90 ml-1">
              {nearbyPlaces.map((place, i) => (
                <li key={i}>{place}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Activities */}
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-wider text-rose-800 mb-2">Activities</p>
          <ul className="list-disc list-inside space-y-1 ml-1 text-rose-900/90">
            {(activities || []).map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>

        {/* Budget summary */}
        <div className="mb-6 p-4 rounded-2xl bg-rose-100/40 border border-rose-200">
          <p className="text-sm font-bold uppercase tracking-wider text-rose-800 mb-2">Budget Breakdown</p>
          <div className="grid grid-cols-2 gap-2 text-sm text-rose-900/90 mb-2">
            <p>Dinner: ₹{budgetBreakdown?.dinner ?? 0}</p>
            <p>Activities: ₹{budgetBreakdown?.activities ?? 0}</p>
            <p>Travel: ₹{budgetBreakdown?.travel ?? 0}</p>
          </div>
          <p className="font-bold text-rose-700 text-lg border-t border-rose-200 pt-2 mt-1">Total: ₹{budgetBreakdown?.total ?? 0}</p>
        </div>

        {/* Timeline */}
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-wider text-rose-800 mb-3">Timeline</p>
          <ul className="space-y-3 relative">
            <div className="absolute left-[6.5px] top-2 bottom-2 w-0.5 bg-rose-200/60 rounded-full"></div>
            {(timeline || []).map((item, i) => (
              <li key={i} className="flex gap-4 relative z-10">
                <div className="w-3.5 h-3.5 bg-rose-400 rounded-full border-2 border-white mt-1 shrink-0 shadow-sm" />
                <div>
                  <span className="font-bold text-rose-600 block text-sm">{item.time}</span>
                  <span className="text-rose-950">{item.event}{item.location ? ` · ${item.location}` : ''}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Tips, outfit, surprise moment, backup */}
        {hasDetails && (
          <div className="space-y-4 pt-6 border-t font-light border-rose-200">
            {surpriseMoment && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100">
                <p className="text-sm font-bold text-rose-600 mb-1">✨ Surprise Moment</p>
                <p className="text-rose-900 text-sm leading-relaxed">{surpriseMoment}</p>
              </div>
            )}
            {tips?.length > 0 && (
              <div>
                <p className="text-sm font-bold text-rose-800 mb-1">❤️ Tips for Success</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-rose-900/80">
                  {tips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
            {outfitSuggestion && (
              <div>
                <p className="text-sm font-bold text-rose-800 mb-1">👗 Outfit Suggestion</p>
                <p className="text-sm text-rose-900/80">{outfitSuggestion}</p>
              </div>
            )}
            {backupIdea && (
              <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                <p className="text-sm font-bold text-slate-600 mb-1">☔ Backup Idea</p>
                <p className="text-sm text-slate-700">{backupIdea}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <button
          type="button"
          onClick={() => onSurprise?.(getRandomSurprise())}
          className="px-6 py-3 rounded-2xl bg-white/40 border-2 border-rose-200 text-rose-800 font-bold hover:bg-rose-50 hover:border-rose-300 transition shadow-sm hover:shadow-md"
        >
          🎲 Add a twist
        </button>
        <button
          type="button"
          onClick={downloadPDF}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-lg shadow-rose-300/40 hover:shadow-xl hover:scale-105 active:scale-95 transition"
        >
          📄 Download PDF
        </button>
      </div>

      {plan.surpriseIdea && (
        <div className="p-6 rounded-3xl bg-white/60 border-2 border-rose-200 shadow-lg animate-fade-in-up">
          <p className="text-sm font-bold text-rose-600 mb-1">✨ New Twist Added!</p>
          <p className="text-rose-950 text-lg">{plan.surpriseIdea}</p>
        </div>
      )}
    </div>
  );
}
