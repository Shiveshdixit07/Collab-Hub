const axios = require('axios');

async function analyzeInstagram(username) {
    try {
        const url = `https://www.instagram.com/${username}/`;
        console.log("url is", url);
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            timeout: 8000
        });

        const html = res.data;

        // Try to extract window._sharedData which contains user & recent posts metadata
        const sharedDataMatch = html.match(/window\._sharedData\s*=\s*(\{.*?\});/s);

        if (sharedDataMatch) {
            let parsed;
            try {
                parsed = JSON.parse(sharedDataMatch[1]);
            } catch (err) {
                return { exists: false, error: 'Failed to parse sharedData' };
            }

            const user = parsed.entry_data?.ProfilePage?.[0]?.graphql?.user;
            if (!user) return { exists: false };

            const followers = user.edge_followed_by?.count || 0;
            const edges = user.edge_owner_to_timeline_media?.edges || [];
            const recent = edges.slice(0, 10);
            const likesArr = recent.map(e => e.node?.edge_liked_by?.count || 0).filter(n => typeof n === 'number');
            const avgLikes = likesArr.length ? Math.round(likesArr.reduce((a, b) => a + b, 0) / likesArr.length) : 0;
            const engagement = followers ? parseFloat(((avgLikes / followers) * 100).toFixed(2)) : 0;

            return { exists: true, followers, avgLikes, engagement, recentCount: likesArr.length };
        }

        // Try to parse Next.js/__NEXT_DATA__ JSON payload which Instagram may include
        const nextDataMatch = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i) || html.match(/<script[^>]*type="application\/json"[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
        if (nextDataMatch) {
            try {
                const nextJson = JSON.parse(nextDataMatch[1]);

                function findUserObject(obj) {
                    if (!obj || typeof obj !== 'object') return null;
                    if (obj.edge_followed_by && (obj.edge_owner_to_timeline_media || obj.edge_media_to_caption)) return obj;
                    for (const key of Object.keys(obj)) {
                        try {
                            const found = findUserObject(obj[key]);
                            if (found) return found;
                        } catch (e) {
                            // ignore
                        }
                    }
                    return null;
                }

                const userObj = findUserObject(nextJson.props || nextJson);
                if (userObj) {
                    const followers = userObj.edge_followed_by?.count || 0;
                    const edges = userObj.edge_owner_to_timeline_media?.edges || userObj.edge_media_to_caption?.edges || [];
                    const recent = edges.slice(0, 10);
                    const likesArr = recent.map(e => e.node?.edge_liked_by?.count || 0).filter(n => typeof n === 'number');
                    const avgLikes = likesArr.length ? Math.round(likesArr.reduce((a, b) => a + b, 0) / likesArr.length) : 0;
                    const engagement = followers ? parseFloat(((avgLikes / followers) * 100).toFixed(2)) : 0;
                    return { exists: true, followers, avgLikes, engagement, recentCount: likesArr.length };
                }
            } catch (err) {
                // continue to other fallbacks
            }
        }

        // Fallback: try to parse ld+json (may not contain metrics)
        const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
        if (ldMatch) {
            try {
                const ld = JSON.parse(ldMatch[1]);
                // ld may indicate the profile exists
                return { exists: true, followers: null, avgLikes: null, engagement: null, recentCount: 0 };
            } catch (err) {
                // ignore
            }
        }

        // Try the Instagram internal web_profile_info API as a fallback
        try {
            const apiUrl = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
            const apiRes = await axios.get(apiUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'x-ig-app-id': '936619743392459'
                },
                timeout: 8000
            });

            // apiRes.data may contain { data: { user: { ... } } } or { user: {...} }
            const apiUser = apiRes.data?.data?.user || apiRes.data?.user || apiRes.data;
            if (apiUser) {
                const followers = apiUser.edge_followed_by?.count || 0;
                const edges = apiUser.edge_owner_to_timeline_media?.edges || apiUser.edge_media_to_caption?.edges || [];
                const recent = edges.slice(0, 10);
                const likesArr = recent.map(e => e.node?.edge_liked_by?.count || 0).filter(n => typeof n === 'number');
                const avgLikes = likesArr.length ? Math.round(likesArr.reduce((a, b) => a + b, 0) / likesArr.length) : 0;
                const engagement = followers ? parseFloat(((avgLikes / followers) * 100).toFixed(2)) : 0;
                return { exists: true, followers, avgLikes, engagement, recentCount: likesArr.length };
            }
        } catch (err) {
            console.log('web_profile_info fallback failed:', err.message);
        }

        return { exists: false };
    } catch (error) {
        // network or block by instagram
        return { exists: false, error: error.message };
    }
}

module.exports = { analyzeInstagram };
