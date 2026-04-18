"use client"

import { useState } from "react"
import type { StudyItem } from "@/types/study-item"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Calendar,
  Trash2,
  MoreVertical,
  Edit,
  CheckCircle,
  ClockIcon,
  AlertCircle,
  Building,
  BookOpen,
  Link2,
  FileText,
  ExternalLink,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface StudyCardProps {
  item: StudyItem
  onDelete: (id: string) => void
  onUpdateStatus: (id: string, status: string, observation?: string) => void
  onEdit: (item: StudyItem) => void
}

export function StudyCard({ item, onDelete, onUpdateStatus, onEdit }: StudyCardProps) {
  const [showObservationDialog, setShowObservationDialog] = useState(false)
  const [observation, setObservation] = useState(item.observation || "")

  const timeAgo = formatDistanceToNow(new Date(item.createdAt), {
    addSuffix: true,
    locale: ptBR,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluido":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pendente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "aguardando":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "concluido":
        return <CheckCircle className="h-4 w-4" />
      case "pendente":
        return <ClockIcon className="h-4 w-4" />
      case "aguardando":
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const handleStatusChange = (status: string) => {
    if (status === "aguardando" && !item.observation) {
      setShowObservationDialog(true)
    } else {
      onUpdateStatus(item.id, status)
    }
  }

  const handleObservationSave = () => {
    onUpdateStatus(item.id, "aguardando", observation)
    setShowObservationDialog(false)
  }

  const renderLinks = () => {
    if (!item.studyLinks) return null

    const links = item.studyLinks.split("\n").filter((link) => link.trim())
    if (links.length === 0) return null

    return (
      <div className="mt-3 space-y-1">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
          <Link2 className="h-3.5 w-3.5" /> Links de estudo:
        </h4>
        <div className="space-y-1">
          {links.map((link, index) => (
            <a
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              {link.length > 50 ? link.substring(0, 50) + "..." : link}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <Card
        className={`border-l-4 transition-all ${
          item.status === "concluido"
            ? "border-l-green-500 bg-green-50/50 dark:bg-green-950/20"
            : item.status === "aguardando"
              ? "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
              : "border-l-yellow-500 hover:shadow-md"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-lg text-slate-800 dark:text-slate-100">{item.subject}</h3>
                  <Badge className={`${getStatusColor(item.status)} flex items-center gap-1`}>
                    {getStatusIcon(item.status)}
                    {item.status === "concluido" ? "Concluído" : item.status === "pendente" ? "Pendente" : "Aguardando"}
                  </Badge>
                </div>

                {item.category && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">Categoria: {item.category}</p>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-500">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Opções</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleStatusChange("concluido")}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar como concluído
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("pendente")}>
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Marcar como pendente
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("aguardando")}>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Marcar como aguardando
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onEdit(item)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-red-600 dark:text-red-400">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>{item.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>{item.periodicity}</span>
              </div>

              {item.institution && (
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4 text-slate-400" />
                  <span>{item.institution}</span>
                </div>
              )}

              {item.reference && (
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4 text-slate-400" />
                  <span>{item.reference}</span>
                </div>
              )}
            </div>

            {item.observation && (
              <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-medium">Observação:</span> {item.observation}
                </p>
              </div>
            )}

            {renderLinks()}

            {item.pdfFileName && (
              <div className="mt-2">
                <a
                  href={item.pdfBase64}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <FileText className="h-4 w-4" />
                  {item.pdfFileName}
                </a>
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400">Adicionado {timeAgo}</p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showObservationDialog} onOpenChange={setShowObservationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar observação</DialogTitle>
            <DialogDescription>
              Adicione uma observação para explicar por que este estudo está aguardando.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Ex: Aguardando material complementar..."
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowObservationDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleObservationSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

