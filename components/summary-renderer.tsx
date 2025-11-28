"use client";

export default function SummaryRenderer({ data }: { data: any }) {
  return (
    <div className="space-y-6 leading-relaxed text-[15px]">
      {/* Quick Summary */}
      <div>
        <h2 className="font-bold text-lg mb-2">Quick Summary</h2>
        <p className="text-foreground">{data.quickSummary}</p>
      </div>

      {/* Key Details */}
      <div>
        <h2 className="font-bold text-lg mb-2">Key Details</h2>

        <ul className="space-y-1">
          {data.courseName && (
            <li>
              <span className="font-semibold">Course name:</span>{" "}
              {data.courseName}
            </li>
          )}
          {data.university && (
            <li>
              <span className="font-semibold">University:</span>{" "}
              {data.university}
            </li>
          )}
          {data.duration && (
            <li>
              <span className="font-semibold">Duration:</span> {data.duration}
            </li>
          )}
          {data.tuitionFees && (
            <li>
              <span className="font-semibold">Tuition fees:</span>{" "}
              {data.tuitionFees}
            </li>
          )}
          {data.deadlines && (
            <li>
              <span className="font-semibold">Deadlines:</span> {data.deadlines}
            </li>
          )}
          {data.admissionRequirements && (
            <li>
              <span className="font-semibold">Admission requirements:</span>{" "}
              {data.admissionRequirements}
            </li>
          )}
          {data.teachingLanguage && (
            <li>
              <span className="font-semibold">Teaching language:</span>{" "}
              {data.teachingLanguage}
            </li>
          )}
          {data.universityReputation && (
            <li>
              <span className="font-semibold">University reputation:</span>{" "}
              {data.universityReputation}
            </li>
          )}
          {data.admissionDifficulty && (
            <li>
              <span className="font-semibold">Admission difficulty:</span>{" "}
              {data.admissionDifficulty}
            </li>
          )}
        </ul>
      </div>

      {/* Ideal Applicant Profile */}
      {data.idealApplicantProfile && (
        <div>
          <h2 className="font-bold text-lg mb-2">Ideal Applicant Profile</h2>
          <p>{data.idealApplicantProfile}</p>
        </div>
      )}
    </div>
  );
}
