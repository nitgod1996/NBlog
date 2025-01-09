import store from '@/store'

/**
 * 给title加上一个前缀（如果有的话）
 * @param pageTitle
 * @return {string|*}
 */
export default function getPageTitle(pageTitle) {
	const title = store.state.siteInfo.webTitleSuffix

	if (pageTitle) {
		if (title) {
			return `${pageTitle}${title}`
		}
		return pageTitle
	}
	return title
}
