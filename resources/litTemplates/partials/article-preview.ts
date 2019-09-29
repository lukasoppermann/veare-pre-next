const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
export default (article) => html`
<li class="o-article-preview o-article-preview--${article.fields.category.fields.slug}" itemprop="blogPost" itemscope itemtype="http://schema.org/BlogPosting">
    <div class="o-article-preview__meta">
        <meta itemprop="author" content="${article.fields.author.name}" />
        <meta itemprop="publisher" content="vea.re" />
        <time itemprop="datePublished" class="o-article-preview__date" datetime="${article.fields.date}">${article.fields.date}</time>
        ${!article.fields.category.fields.title ? ''
          : unsafeHTML('<a href="" class="o-article-preview__category o-article-preview__category--' + article.fields.category.fields.slug + '">' + article.fields.category.fields.title + '</a>')
        }
        <time class="o-article-preview__read-time" datetime="${article.fields.readingTime}m">${article.fields.readingTime} min read</time>
    </div>
    <a itemprop="url" class="o-article-preview__link" title="Read: ${article.fields.title}" href="/blog/${article.fields.slug}">
    <link itemprop="mainEntityOfPage" href="${article.fields.slug}" />
        <h3 class="o-article-preview__title" itemprop="name headline">${article.fields.title}</h3>
        <p class="o-article-preview__excerpt" itemprop="description">${article.fields.preview}</p>
    </a>
</li>
`
