const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
export default (article) => html`
<div class="Article__preview o-article-preview--${article.fields.category}" itemprop="blogPost" itemscope itemtype="http://schema.org/BlogPosting">
    <div class="Article__preview__meta">
        <meta itemprop="author" content="Lukas Oppermann" />
        <meta itemprop="publisher" content="vea.re" />
        <time itemprop="datePublished" class="Article__preview__date" datetime="${article.fields.rawLastIteration}">${article.fields.lastIteration}</time>
        ${!article.fields.category ? ''
          : unsafeHTML('<a href="" class="Article__preview__category Article__preview__category--' + article.fields.category + '">' + article.fields.category + '</a>')
        }
        <time class="Article__preview__read-time" datetime="${article.fields.readingTime}m">${article.fields.readingTime} min read</time>
    </div>
    <a itemprop="url" class="Article__preview__link" title="Read: ${article.fields.title}" href="/blog/${article.fields.slug}">
    <link itemprop="mainEntityOfPage" href="${article.fields.slug}" />
        <h3 class="Article__preview__title" itemprop="name headline">${article.fields.title}</h3>
        <p class="Article__preview__excerpt" itemprop="description">${article.fields.description}</p>
    </a>
</div>
`
