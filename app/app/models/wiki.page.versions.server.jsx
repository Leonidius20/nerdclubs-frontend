import { get, putWithAuthorization } from './utils.server';

export async function getWikiPageVersions(wikiPageId) {
  return await get(`wiki-page-versions?wiki_page_id=${wikiPageId}`);
}

export async function getWikiPageVersionById(wikiPageVersionId) {
    return await get(`wiki-page-versions/${wikiPageVersionId}`);
}

export async function rollbackTo(request, community_id, wiki_page_version_id) {
    return await putWithAuthorization(request, `wiki-page-versions/rollback`, 
    { community_id, wiki_page_version_id });
}