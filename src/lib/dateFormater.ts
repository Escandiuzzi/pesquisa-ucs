export function formatDate(dateString: string) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
}

export function isCurrentDateGreater(dateString: string): boolean {
    const inputDate = new Date(dateString);

    const currentDate = new Date();

    console.log(currentDate, inputDate);
    console.log(currentDate > inputDate);

    return currentDate > inputDate;
}

export function getProjectStatus(endDateString: string) {
    console.log(endDateString);
    if (
        endDateString === null ||
        endDateString === undefined ||
        isCurrentDateGreater(endDateString)
    ) {
        return "Concluído";
    }

    return "Em andamento";
}