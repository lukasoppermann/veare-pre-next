---
title: How to integrate mailchimp into your blog
tags: tag1, tag2
author: Lukas Oppermann
---

> In this article I will quickly walk you through the steps necessary to setup a simple mailchimp account and add a signup form to your blog or website.

## Setting up mailchimp

The first step is to sign up for a free [mailchimp](https://mailchimp.com) account, which is good for 2000 subscribers and 12000 emails per month, enough for now. Once you have your account, create a new list, you will have to confirm the email address that will used for the email.

Perfect, we are nearly done here, just jump to the `signup forms` section, select `Embedded forms`, go the the section `Naked` and unselect everything so that only *Show only required fields* is selected, you should get a form luke the one below.

```html
<!-- Begin MailChimp Signup Form -->
<div id="mc_embed_signup">
<form action="//veare.us5.list-manage.com/subscribe/post?u=455a7e8b5be94e8ce77bf980a&amp;id=93e3ca61d2" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
    <div id="mc_embed_signup_scroll">

<div class="mc-field-group">
	<label for="mce-EMAIL">Email Address </label>
	<input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL">
</div>
	<div id="mce-responses" class="clear">
		<div class="response" id="mce-error-response" style="display:none"></div>
		<div class="response" id="mce-success-response" style="display:none"></div>
	</div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
    <div style="position: absolute; left: -5000px;"><input type="text" name="b_455a7e8b5be94e8ce77bf980a_93e3ca61d2" tabindex="-1" value=""></div>
    <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"></div>
    </div>
</form>
</div>
<!--End mc_embed_signup-->
```
