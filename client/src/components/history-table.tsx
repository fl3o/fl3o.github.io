import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { History, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type { RatioEntry } from "@shared/schema";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatSize, getRatioStatus, getRatioStatusColor, getRatioStatusLabel } from "@/lib/ratio-utils";
import { useState } from "react";

interface HistoryTableProps {
  entries: RatioEntry[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const ITEMS_PER_PAGE = 5;

export function HistoryTable({ entries, onDelete, isDeleting }: HistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
  );

  const totalPages = Math.ceil(sortedEntries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEntries = sortedEntries.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            Historique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Aucun enregistrement</p>
            <p className="text-sm">Vos statistiques sauvegardées apparaîtront ici</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            Historique
          </CardTitle>
          <Badge variant="secondary">
            {entries.length} entrée{entries.length > 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Upload</TableHead>
                <TableHead className="text-right">Download</TableHead>
                <TableHead className="text-right">Ratio</TableHead>
                <TableHead className="text-right">Statut</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEntries.map((entry) => {
                const status = getRatioStatus(entry.ratio);
                const statusColor = getRatioStatusColor(status);
                const statusLabel = getRatioStatusLabel(status);

                return (
                  <TableRow key={entry.id} data-testid={`row-history-${entry.id}`}>
                    <TableCell className="font-medium">
                      {format(new Date(entry.recordedAt), "dd MMM yyyy, HH:mm", { locale: fr })}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatSize(entry.upload)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatSize(entry.download)}
                    </TableCell>
                    <TableCell className={`text-right tabular-nums font-semibold ${statusColor}`}>
                      {entry.ratio.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={statusColor}>
                        {statusLabel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(entry.id)}
                        disabled={isDeleting}
                        data-testid={`button-delete-${entry.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden space-y-3">
          {paginatedEntries.map((entry) => {
            const status = getRatioStatus(entry.ratio);
            const statusColor = getRatioStatusColor(status);
            const statusLabel = getRatioStatusLabel(status);

            return (
              <div
                key={entry.id}
                className="p-4 rounded-lg bg-muted/50 space-y-2"
                data-testid={`card-history-${entry.id}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(entry.recordedAt), "dd MMM yyyy, HH:mm", { locale: fr })}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(entry.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Upload</p>
                    <p className="font-medium tabular-nums">{formatSize(entry.upload)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Download</p>
                    <p className="font-medium tabular-nums">{formatSize(entry.download)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Ratio</p>
                    <p className={`text-xl font-bold tabular-nums ${statusColor}`}>
                      {entry.ratio.toFixed(2)}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={statusColor}>
                  {statusLabel}
                </Badge>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              data-testid="button-prev-page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              data-testid="button-next-page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
