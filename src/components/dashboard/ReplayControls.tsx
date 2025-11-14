import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Play, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface ReplayControlsProps {
  isReplayMode: boolean;
  replayDate: Date | null;
  availableDates: Date[];
  onEnterReplay: (date: Date) => void;
  onExitReplay: () => void;
  onNavigateDate: (date: Date) => void;
  isLoading: boolean;
}

export function ReplayControls({
  isReplayMode,
  replayDate,
  availableDates,
  onEnterReplay,
  onExitReplay,
  onNavigateDate,
  isLoading,
}: ReplayControlsProps) {
  const [date, setDate] = useState<Date>();

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setDate(selectedDate);
    if (isReplayMode) {
      onNavigateDate(selectedDate);
    } else {
      onEnterReplay(selectedDate);
    }
  };

  const navigatePrevious = () => {
    if (!replayDate) return;
    const currentIndex = availableDates.findIndex(
      d => format(d, "yyyy-MM-dd") === format(replayDate, "yyyy-MM-dd")
    );
    if (currentIndex < availableDates.length - 1) {
      const prevDate = availableDates[currentIndex + 1];
      setDate(prevDate);
      onNavigateDate(prevDate);
    }
  };

  const navigateNext = () => {
    if (!replayDate) return;
    const currentIndex = availableDates.findIndex(
      d => format(d, "yyyy-MM-dd") === format(replayDate, "yyyy-MM-dd")
    );
    if (currentIndex > 0) {
      const nextDate = availableDates[currentIndex - 1];
      setDate(nextDate);
      onNavigateDate(nextDate);
    }
  };

  const canNavigatePrevious = () => {
    if (!replayDate) return false;
    const currentIndex = availableDates.findIndex(
      d => format(d, "yyyy-MM-dd") === format(replayDate, "yyyy-MM-dd")
    );
    return currentIndex < availableDates.length - 1;
  };

  const canNavigateNext = () => {
    if (!replayDate) return false;
    const currentIndex = availableDates.findIndex(
      d => format(d, "yyyy-MM-dd") === format(replayDate, "yyyy-MM-dd")
    );
    return currentIndex > 0;
  };

  if (isReplayMode && replayDate) {
    return (
      <Alert className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
              <span className="font-semibold text-purple-700 dark:text-purple-300">
                Modo Replay
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={navigatePrevious}
                disabled={!canNavigatePrevious() || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "min-w-[200px] justify-start text-left font-normal",
                      !replayDate && "text-muted-foreground"
                    )}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(replayDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={replayDate}
                    onSelect={handleDateSelect}
                    disabled={(date) =>
                      date > new Date() ||
                      !availableDates.some(
                        d => format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                      )
                    }
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              <Button
                variant="outline"
                size="sm"
                onClick={navigateNext}
                disabled={!canNavigateNext() || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onExitReplay}
            className="gap-2"
          >
            <XCircle className="h-4 w-4" />
            Voltar ao Tempo Real
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Play className="h-4 w-4" />
            Modo Replay
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4 space-y-2">
            <p className="text-sm font-medium">Viajar no Tempo</p>
            <p className="text-xs text-muted-foreground">
              Selecione uma data para visualizar dados históricos
            </p>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={(date) =>
              date > new Date() ||
              !availableDates.some(
                d => format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
              )
            }
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
