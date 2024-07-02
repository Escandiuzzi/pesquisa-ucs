export function formatDate(dateString?: string | null) {
  if (!dateString) {
    return undefined;
  }
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
}

export function isCurrentDateGreater(dateString: string): boolean {
  const inputDate = new Date(dateString);
  const currentDate = new Date();

  return currentDate > inputDate;
}

export function getProjectStatus(endDateString?: string | null) {
  if (
    endDateString !== null &&
    endDateString !== undefined &&
    isCurrentDateGreater(endDateString)
  ) {
    return "Concluído";
  }

  return "Em andamento";
}
