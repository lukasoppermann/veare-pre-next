// get correct filesnames after appending unique string
import slugToUrl from '../../services/slugToUrl'
import articlePreview from '../newPartials/article_preview'
import { revFile } from '../../services/files'
import layout from '../layout'
import { templateInterface } from '../../../types/template'
import { transformedArticleFields } from '../../../types/transformer'
import { requestInterface } from '../../../types/request'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
// export template
export default (article: transformedArticleFields, req: requestInterface): templateInterface => layout(html`
  <main class="Page__Article" slug="${req.path}">
    <div class="Article">
      <h1>${article.title}</h1>
      <div class="Article__publication-details">
        Last iteration <time class="Article__time" itemprop="datePublished" datetime="${article.rawLastIteration}">${article.lastIteration}</time>
        •&nbsp;
        <time class="Article__read-time" datetime="${article.readingTime}m">${article.readingTime} min read</time>
      </div>

      <div class="Article__author">
          — Published by <span itemprop="author" itemscope itemtype="http://schema.org/Person">
            <a class="author" href="https://twitter.com/lukasoppermann" itemprop="url" title="Twitter account of Lukas Oppermann" rel="author">
              <span itemprop="name">Lukas Oppermann</span></a></span> /
          <span itemprop="publisher" itemtype="http://schema.org/Organization" itemscope>
            <a itemprop="url" href="http://vea.re">
              <span itemprop="name">vea.re</span>
            </a>
          </span>
      </div>

      ${unsafeHTML(article.content)}

      <div class="newsletter-signup">
        <!-- Begin Mailchimp Signup Form -->
        <div id="mc_embed_signup">
        <form action="https://vea.us1.list-manage.com/subscribe/post?u=ccfc09fac7c56ed9104545178&amp;id=061df8693e" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
          <div id="mc_embed_signup_scroll">
            <label for="mce-EMAIL">Sign up to get informed about new posts &amp; projects.</label>
            <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_ccfc09fac7c56ed9104545178_061df8693e" tabindex="-1" value=""></div>
            <input type="email" value="" name="EMAIL" class="email" id="mce-EMAIL" placeholder="email address" required>
            <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button">
          </div>
        </form>
        </div>
        <!--End mc_embed_signup-->
      </div>
      <ul class="related-content">
        ${repeat(article.relatedContent, (entry, index) => {
          return html`<li class="related-content-item related-content-item--${index + 1}">${articlePreview(entry.fields)}</li>`
        })}
      </ul>
    </div>
      </main>
`, {
  title: article.title,
  description: article.description,
  bodyClass: 'Page-Type__Article',
  og: [
    {
      property: 'og:type',
      value: 'website'
    },
    {
      property: 'og:title',
      value: article.title
    },
    {
      property: 'og:description',
      value: article.description
    },
    {
      property: 'og:url',
      value: 'https://vea.re' + slugToUrl(article.slug, 'article')
    }
    // {
    //   property: 'og:image',
    //   value: 'https:' + 'project.previewImage.fields.image.fields.url' + '?fm=jpg'
    // }, {
    //   property: 'og:image:type',
    //   value: 'image/jpeg'
    // }, {
    //   property: 'og:image:alt',
    //   value: 'project.header.fields.title'
    // }
  ],
  twitter: [
    {
      property: 'twitter:card',
      value: 'summary_large_image'
    },
    {
      property: 'twitter:title',
      value: article.title
    },
    {
      property: 'twitter:description',
      value: article.description
    },
    {
      property: 'twitter:url',
      value: 'https://vea.re' + slugToUrl(article.slug, 'article')
    }//,
    // {
    //   property: 'twitter:image',
    //   value: 'https:' + 'project.previewImage.fields.image.fields.url' + '?fm=jpg'
    // }
  ],
  head: html`
  <link type="text/css" href="/${revFile('css/blog.css')}" rel="stylesheet" />
  `
}, req)
