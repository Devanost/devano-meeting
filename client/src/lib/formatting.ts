/**
 * Format a date to a readable time string
 * Shows time if today, date if this week, full date otherwise
 */
export function formatMessageTime(date: Date): string {
  const now = new Date();
  const messageDate = new Date(date);
  
  // Same day - show time only
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  
  // This week - show day and time
  const daysAgo = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysAgo < 7) {
    return messageDate.toLocaleDateString("en-US", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  
  // Older - show full date
  return messageDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: messageDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Format meeting duration in human-readable format
 */
export function formatDuration(startDate: Date, endDate?: Date): string {
  const end = endDate || new Date();
  const durationMs = new Date(end).getTime() - new Date(startDate).getTime();
  
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Format a date for display in meeting cards
 */
export function formatMeetingDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get initials from a name for avatar display
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
