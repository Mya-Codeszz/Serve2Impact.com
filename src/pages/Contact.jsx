import React, { useState } from "react";
import { Loader2, Check } from "lucide-react";
import Asset from "@/components/Asset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | submitting | success

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setStatus("submitting");
    // Frontend-only preview: simulate a brief submit, then show success.
    // No email is actually sent yet — this will be wired to a backend later.
    setTimeout(() => {
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 700);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="relative text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary">Say hello</h1>
        <p className="mt-2 text-foreground/70">Questions, partnerships, or just a wave — we'd love to hear from you.</p>
        <Asset name="sparkles.png" alt="" width={50} className="absolute top-0 right-4 rotate-pos-4 hidden sm:block" />
      </div>

      {status === "success" ? (
        <div className="paper rounded-2xl border border-border/70 p-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 text-accent mb-3">
            <Check className="w-7 h-7" />
          </div>
          <h2 className="font-hand text-2xl text-primary">Thanks — we got it!</h2>
          <p className="text-foreground/70 mt-2">Your message has been submitted. We'll be in touch soon.</p>
          <p className="text-xs text-foreground/50 mt-2">(This is a preview form — messages aren't delivered yet.)</p>
          <Button className="btn-grass mt-5" onClick={() => setStatus("idle")}>
            Send another
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="paper rounded-xl border border-border/70 p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Your name <span className="text-destructive">*</span></Label>
              <Input id="name" value={form.name} onChange={set("name")} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
              <Input id="email" type="email" value={form.email} onChange={set("email")} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject <span className="text-destructive">*</span></Label>
            <Input id="subject" value={form.subject} onChange={set("subject")} placeholder="What's this about?" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
            <Textarea id="message" rows={5} value={form.message} onChange={set("message")} required />
          </div>
          <Button type="submit" className="btn-grass w-full h-12" disabled={status === "submitting"}>
            {status === "submitting" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Send message
          </Button>
          <p className="text-xs text-foreground/45 text-center">Preview form — your message isn't sent yet.</p>
        </form>
      )}
    </div>
  );
}