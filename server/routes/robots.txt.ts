export default defineEventHandler((event) => {
  const robots = `User-agent: *
Allow: /

Sitemap: https://www.worldtripagency.com/sitemap.xml`

  event.node.res.setHeader('Content-Type', 'text/plain')
  return robots
})


