import React from 'react';
import { Mail, MapPin, CreditCard, ExternalLink, MessageCircle } from 'lucide-react';

export const DetailsTab: React.FC = () => {
  const InfoItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    displayValue?: string;
    isLink?: boolean;
  }> = ({ icon, label, value, displayValue, isLink = false }) => (
    <div className="flex items-start space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-xs uppercase font-semibold text-slate-500 tracking-wider mb-0.5">
          {label}
        </h3>
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-semibold transition flex items-center gap-1 break-all text-sm"
          >
            {displayValue || value} <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        ) : (
          <p className="text-slate-900 font-semibold break-all text-sm">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight mb-6">About & Support</h1>
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6 shadow-sm">
        <div className="space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base">
          <p>
            Hi, this app is created by <span className="font-bold text-slate-900">Sanket Gund</span> from{' '}
            <span className="text-blue-600 font-semibold">Dharashiv, Maharashtra, India</span>.
          </p>
          <p>
            It was built to solve the needs of tracking trading records—including Calendar,
            Journal, Performance Metrics, Discipline Rules, Goals, and Achievements—all in a
            single, privacy-first application without paying any subscription fees.
          </p>
          <p>
            If you find this application helpful, you can show your support on the UPI address below. I am actively working on adding features! If you have feedback or feature requests, please send an email with the title <span className="text-blue-600 font-semibold">"Trading Journal By SG Feedback"</span>.
          </p>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h2 className="text-lg font-serif font-bold text-slate-900 mb-4">Contact & Support Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              icon={<Mail className="w-5 h-5" />}
              label="Contact Email"
              value="mailto:sanketgund444@gmail.com"
              displayValue="sanketgund444@gmail.com"
              isLink={true}
            />
            <InfoItem
              icon={<MapPin className="w-5 h-5" />}
              label="Location"
              value="Dharashiv, Maharashtra, India"
            />
            <InfoItem
              icon={<CreditCard className="w-5 h-5" />}
              label="UPI ID"
              value="sanketgund@icici"
            />
            <InfoItem
              icon={<MessageCircle className="w-5 h-5" />}
              label="Instagram"
              value="https://www.instagram.com/sanket_gund"
              displayValue="@sanket_gund"
              isLink={true}
            />
            <InfoItem
              icon={<MessageCircle className="w-5 h-5" />}
              label="Telegram"
              value="https://t.me/sanketgund777"
              displayValue="@sanketgund777"
              isLink={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
