const { html } = require('@popeindustries/lit-html-server')

export default (article) => html`
  <a itemprop="url" title="Read: ${article.title}" class="article__preview" href="/blog/${article.slug}">
    <h3 itemprop="name headline">${article.title}</h3>
    <div class="details">
      <meta itemprop="author" content="Lukas Oppermann" />
      <meta itemprop="publisher" content="vea.re" />
      <time itemprop="datePublished" class="date" datetime="${article.rawLastIteration}">${article.lastIteration}</time>
      <time class="read-time" datetime="${article.readingTime}m">${article.readingTime} min read</time>
      <link itemprop="mainEntityOfPage" href="${article.slug}" />
    </div>
  </a>
`
