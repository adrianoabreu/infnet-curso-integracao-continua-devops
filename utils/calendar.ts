/**
 * Cria um link para adicionar um evento ao Google Calendar
 */
export function createGoogleCalendarLink(params: {
  title: string
  description: string
  location?: string
  startDate: Date
  endDate: Date
  recurrence?: string // Parâmetro de recorrência
}): string {
  const { title, description, location, startDate, endDate, recurrence } = params

  // Formatar datas no formato ISO 8601
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, "")
  }

  const startDateFormatted = formatDate(startDate)
  const endDateFormatted = formatDate(endDate)

  // Construir URL com parâmetros
  const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE"
  const titleParam = `&text=${encodeURIComponent(title)}`
  const datesParam = `&dates=${startDateFormatted}/${endDateFormatted}`
  const detailsParam = `&details=${encodeURIComponent(description)}`
  const locationParam = location ? `&location=${encodeURIComponent(location)}` : ""
  const recurrenceParam = recurrence ? `&recur=${encodeURIComponent(recurrence)}` : ""

  return `${baseUrl}${titleParam}${datesParam}${detailsParam}${locationParam}${recurrenceParam}`
}

/**
 * Calcula a data de término com base na duração
 */
export function calculateEndDate(startDate: Date, durationText: string): Date {
  const endDate = new Date(startDate)

  // Tentar extrair números e unidades da string de duração
  const minutes = extractMinutes(durationText)

  // Adicionar minutos à data de início
  endDate.setMinutes(endDate.getMinutes() + minutes)

  return endDate
}

/**
 * Extrai minutos de uma string de duração
 */
function extractMinutes(durationText: string): number {
  // Converter para minúsculas para facilitar a comparação
  const text = durationText.toLowerCase()

  // Tentar extrair horas
  const hoursMatch = text.match(/(\d+)\s*h/)
  const hours = hoursMatch ? Number.parseInt(hoursMatch[1], 10) : 0

  // Tentar extrair minutos
  const minutesMatch = text.match(/(\d+)\s*min/)
  const minutes = minutesMatch ? Number.parseInt(minutesMatch[1], 10) : 0

  // Se não encontrou nenhum formato específico, tentar extrair apenas números
  if (hours === 0 && minutes === 0) {
    const numbersMatch = text.match(/(\d+)/)
    if (numbersMatch) {
      // Se contém "hora" ou "h", considerar como horas, caso contrário, como minutos
      if (text.includes("hora") || text.includes("h")) {
        return Number.parseInt(numbersMatch[1], 10) * 60
      } else {
        return Number.parseInt(numbersMatch[1], 10)
      }
    }
  }

  // Converter horas para minutos e somar
  return hours * 60 + minutes
}

/**
 * Calcula a próxima data de estudo com base na periodicidade
 */
export function calculateNextStudyDate(periodicityText: string): Date {
  const now = new Date()
  const nextDate = new Date(now)

  // Definir para o próximo horário de estudo (9:00 AM por padrão)
  nextDate.setHours(9, 0, 0, 0)

  // Se já passou das 9:00 AM, agendar para o próximo dia
  if (now.getHours() >= 9) {
    nextDate.setDate(nextDate.getDate() + 1)
  }

  // Ajustar com base na periodicidade
  const periodicity = periodicityText.toLowerCase()

  if (periodicity.includes("semanal")) {
    // Agendar para a próxima segunda-feira se for semanal
    const dayOfWeek = nextDate.getDay() // 0 = Domingo, 1 = Segunda, ...
    const daysUntilMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 0 ? 1 : 8 - dayOfWeek
    nextDate.setDate(nextDate.getDate() + daysUntilMonday)
  } else if (periodicity.includes("mensal")) {
    // Agendar para o primeiro dia do próximo mês
    nextDate.setMonth(nextDate.getMonth() + 1)
    nextDate.setDate(1)
  } else if (periodicity.includes("bissemanal")) {
    // Agendar para a próxima segunda ou quinta
    const dayOfWeek = nextDate.getDay()
    if (dayOfWeek < 1) {
      // Domingo -> Segunda
      nextDate.setDate(nextDate.getDate() + 1)
    } else if (dayOfWeek < 4) {
      // Segunda, Terça, Quarta -> Quinta
      nextDate.setDate(nextDate.getDate() + (4 - dayOfWeek))
    } else {
      // Quinta, Sexta, Sábado -> Segunda
      nextDate.setDate(nextDate.getDate() + (8 - dayOfWeek))
    }
  }

  return nextDate
}

/**
 * Gera o parâmetro de recorrência para o Google Calendar com base na periodicidade
 */
export function getRecurrenceRule(periodicityText: string): string {
  const periodicity = periodicityText.toLowerCase()

  if (periodicity.includes("diário")) {
    return "RRULE:FREQ=DAILY"
  } else if (periodicity.includes("semanal") && !periodicity.includes("bissemanal")) {
    return "RRULE:FREQ=WEEKLY"
  } else if (periodicity.includes("bissemanal")) {
    // Para bissemanal, configuramos para repetir semanalmente em segundas e quintas
    return "RRULE:FREQ=WEEKLY;BYDAY=MO,TH"
  } else if (periodicity.includes("mensal")) {
    return "RRULE:FREQ=MONTHLY"
  }

  // Se não conseguir determinar, não configura recorrência
  return ""
}

