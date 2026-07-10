"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Check, Sparkles, Rocket, Smartphone, Zap, Briefcase, Building2, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useApp, UserRole } from "@/lib/context";

const experienceLevels = [
  { id: "beginner", label: "Pemula", desc: "Baru pertama kali pakai sistem EO", emoji: "🌱" },
  { id: "intermediate", label: "Menengah", desc: "Pernah pakai software serupa", emoji: "🌿" },
  { id: "expert", label: "Expert", desc: "Pengalaman bertahun-tahun di EO", emoji: "🌳" },
] as const;

const focusOptions = [
  { id: "crm", label: "Kelola Prospek", desc: "CRM & follow-up WA" },
  { id: "project", label: "Atur Proyek", desc: "Tugas, rundown, kru" },
  { id: "budget", label: "Keuangan", desc: "Anggaran & margin" },
  { id: "vendor", label: "Cari Vendor", desc: "Marketplace & inventory" },
  { id: "all", label: "Semua", desc: "Saya ingin lihat semuanya" },
] as const;

const roleIcons: Record<UserRole, React.ElementType> = {
  wo: Briefcase,
  vendor: Building2,
  client: User,
};

export function OnboardingTour() {
  const { userRole, setUserRole, showToast } = useApp();
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [seen, setSeen] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("onboarding_seen");
    if (!stored) {
      setTimeout(() => setIsOpen(true), 400);
    } else {
      setSeen(false);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem("onboarding_seen", JSON.stringify({ role: selectedRole, experience: selectedExperience, focus: selectedFocus }));
    if (selectedRole) setUserRole(selectedRole);
    showToast("Siap! Dashboard sudah disesuaikan untuk Anda 🎉");
    setIsOpen(false);
  };

  const handleClose = () => {
    localStorage.setItem("onboarding_seen", JSON.stringify({ skipped: true }));
    if (selectedRole) setUserRole(selectedRole);
    setIsOpen(false);
  };

  const totalSteps = 4;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-full max-w-md mx-4"
          >
            <div className="bg-card border border-border/60 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">
              {/* Progress bar */}
              <div className="h-1 bg-muted">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-500 to-emerald-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="p-6">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground/60 hover:text-foreground transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                {step === 0 && (
                  <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="font-display text-xl font-bold text-foreground">Halo! Selamat Datang di EventOS.id 🎉</h2>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      Satu platform untuk WO/EO Indonesia — CRM, vendor, proyek, keuangan, dan AI dalam satu dashboard.
                    </p>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div key="role" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="font-display text-lg font-bold text-foreground text-center mb-4">Siapa kamu?</h3>
                    <p className="text-sm text-muted-foreground text-center mb-5">Pilih peranmu untuk pengalaman yang lebih sesuai</p>
                    <div className="space-y-2.5">
                      {(["wo", "vendor", "client"] as UserRole[]).map((role) => {
                        const Icon = roleIcons[role];
                        const labels = { wo: "Event Organizer / Wedding Planner", vendor: "Vendor Mitra", client: "Klien / Pasangan" };
                        const descs = { wo: "Kelola proyek, vendor, dan tim", vendor: "Terima job & kolaborasi", client: "Pantau progres pernikahan" };
                        const isSelected = selectedRole === role;
                        return (
                          <button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={cn(
                              "w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left",
                              isSelected
                                ? "border-brand-500/50 bg-brand-500/10"
                                : "border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-border"
                            )}
                          >
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors", isSelected ? "bg-brand-500/20 text-brand-400" : "bg-muted text-muted-foreground")}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-sm text-foreground">{labels[role]}</div>
                              <div className="text-xs text-muted-foreground">{descs[role]}</div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-brand-400 flex-shrink-0 ml-auto" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="experience" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="font-display text-lg font-bold text-foreground text-center mb-4">Seberapa berpengalaman?</h3>
                    <p className="text-sm text-muted-foreground text-center mb-5">Kami akan menyesuaikan tingkat detailnya</p>
                    <div className="space-y-2.5">
                      {experienceLevels.map((exp) => {
                        const isSelected = selectedExperience === exp.id;
                        return (
                          <button
                            key={exp.id}
                            onClick={() => setSelectedExperience(exp.id)}
                            className={cn(
                              "w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left",
                              isSelected
                                ? "border-brand-500/50 bg-brand-500/10"
                                : "border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-border"
                            )}
                          >
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 text-lg">
                              {exp.emoji}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-sm text-foreground">{exp.label}</div>
                              <div className="text-xs text-muted-foreground">{exp.desc}</div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-brand-400 flex-shrink-0 ml-auto" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="focus" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="font-display text-lg font-bold text-foreground text-center mb-4">Mau mulai dari mana?</h3>
                    <p className="text-sm text-muted-foreground text-center mb-5">Fitur akan ditampilkan sesuai prioritasmu</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {focusOptions.map((opt) => {
                        const isSelected = selectedFocus === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setSelectedFocus(opt.id)}
                            className={cn(
                              "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-center",
                              isSelected
                                ? "border-brand-500/50 bg-brand-500/10"
                                : "border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-border"
                            )}
                          >
                            <div className={cn("text-sm font-bold text-foreground")}>{opt.label}</div>
                            <div className="text-xs text-muted-foreground">{opt.desc}</div>
                            {isSelected && <Check className="w-4 h-4 text-brand-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Steps indicator */}
              <div className="flex items-center justify-center gap-1.5 pb-3">
                {Array.from({ length: totalSteps }).map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      idx === step ? "w-6 bg-brand-400" : idx < step ? "w-1.5 bg-brand-400/50" : "w-1.5 bg-muted-foreground/20"
                    )}
                  />
                ))}
              </div>

              <div className="p-4 pt-2 flex items-center justify-between gap-3 border-t border-border/60">
                <Button variant="ghost" size="sm" onClick={handleClose} className="text-xs text-muted-foreground/60">
                  {step < 2 ? "Lewati" : "Selesai"}
                </Button>
                <div className="flex items-center gap-2">
                  {step > 0 && (
                    <Button variant="outline" size="sm" onClick={() => setStep((s) => s - 1)} className="text-xs">
                      Kembali
                    </Button>
                  )}
                  {step < totalSteps - 1 ? (
                    <Button
                      size="sm"
                      onClick={() => setStep((s) => s + 1)}
                      disabled={step === 1 && !selectedRole}
                      className="font-semibold gap-1"
                    >
                      Lanjut <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleComplete}
                      className="font-semibold gap-1.5"
                    >
                      Mulai <Rocket className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
