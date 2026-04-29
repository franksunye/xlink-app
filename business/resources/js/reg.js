// 身份证 
export const isIDNumber = (s) => {
	return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
		.test(s)
}
//护照 
export const isPassport = (s) => {
	// return /(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/
	// 	.test(s)
	return /^[a-zA-Z0-9]{3,21}$/.test(s)
}
// 军官证或士兵证
export const isOfficerID = (s) => {
	return /^[a-zA-Z0-9]{7,21}$/
		.test(s)
}
// 港澳通行证
export const isHongKongID = (s) => {
	return /^[a-zA-Z0-9]{5,21}$/
		.test(s)
}

// 台胞证
export const isMTPs = (s) => {
	return /^(\d{10}[DAB])|(\d{10}\([DAB]\))|(\d{10}\（[DAB]\）)|(830000(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dX])$/.test(s)
}