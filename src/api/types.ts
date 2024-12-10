export interface StreakDay {
  date: string
  isCurrent: boolean
  coinsEarned: number
  bonusReceived: boolean
  bonusAvailable: boolean
}

export interface StreakHistoryResponse {
  days: StreakDay[]
  current_streak: number
  max_daily_streak: number
}
