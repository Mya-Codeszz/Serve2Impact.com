import React from "react";
import Asset from "./Asset";

// Hero social proof — text + decorative UI only, no profile photos.
export default function SocialProof() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Asset name="star.png" alt="" width={28} />
        <p className="font-hand text-2xl text-accent leading-none">Built for students who want to show up for their community</p>
      </div>
    </div>
  );
}