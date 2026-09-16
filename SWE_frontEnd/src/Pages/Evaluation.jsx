import React, { useEffect, useRef, useState } from "react";
import { Search, User, BookOpen, Loader2, AlertCircle } from "lucide-react";

import SearchBox from "../components/evaluation/SearchBox";
import EvaluationResults from "../components/evaluation/EvaluationResults";
import ReviewWizardModal from "../components/evaluation/ReviewWizardModal";

const API_BASE = "https://swe-78u0.onrender.com/api/evaluations";

export default function Evaluation() {
  const [tab, setTab] = useState("doctor");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/search?q=${encodeURIComponent(query.trim())}&type=${tab}`
        );

        if (!res.ok) {
          setSuggestions([]);
          return;
        }

        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
        setShowDropdown(true);
      } catch (err) {
        console.error("فشل جلب الاقتراحات:", err);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, tab]);

  const loadTargetDetails = async (targetId) => {
    setLoading(true);
    setError(null);
    setShowDropdown(false);

    try {
      const res = await fetch(`${API_BASE}/target/${targetId}`);
      if (!res.ok) throw new Error("تعذر جلب التقييمات");

      const data = await res.json();
      setDetails(data);
      setSelectedTarget(data.target);
    } catch {
      setError("حدث خطأ أثناء تحميل البيانات.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setQuery("");
    setDetails(null);
  };

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#faf5ef] font-custom p-4 md:p-8 pb-36 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 mb-16">
        <header className="text-center mb-8">
          <p className="text-sm font-bold text-amber-800/60 mb-2">
            مجتمع هندسة البرمجيات — KSU
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            تقييمات المحاضرين والمقررات
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            شارك تجربتك بحرية وشفافية وساعد زملاءك في التخطيط لفصولهم الدراسية.
          </p>
        </header>

        <SearchBox
          tab={tab}
          query={query}
          suggestions={suggestions}
          showDropdown={showDropdown}
          dropdownRef={dropdownRef}
          onTabChange={handleTabChange}
          onQueryChange={setQuery}
          onSelect={loadTargetDetails}
        />

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            <span className="text-sm font-medium">
              جاري تحميل بيانات التقييم...
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {details && !loading && (
          <EvaluationResults
            details={details}
            onAddReview={() => setIsModalOpen(true)}
          />
        )}

        <div className="h-44 w-full pointer-events-none" />
      </div>

      {isModalOpen && (
        <ReviewWizardModal
          target={selectedTarget}
          targetName={query}
          tab={tab}
          onClose={() => setIsModalOpen(false)}
          onSuccess={(targetId) => {
            setIsModalOpen(false);
            loadTargetDetails(targetId);
          }}
        />
      )}
    </div>
  );
}
