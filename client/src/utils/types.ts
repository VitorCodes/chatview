export type Duration = {
	years: number,
	months: number,
	days: number,
	hours: number,
	minutes: number,
	seconds: number
}

export type Date = {
	year: number,
	month: number,
	day: number,
}

export type Padding = [
	top: number,
	right: number,
	bottom: number,
	left: number
]

export type Participant = {
	name: string,
	total_messages_sent: number,
	top_emojis_sent: Array<Array<any>>
}

export type TimeMessage = {
	[key: number]: number
}