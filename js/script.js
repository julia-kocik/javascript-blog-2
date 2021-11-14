/* eslint-disable no-inner-declarations */
{
  'use strict';

  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorRightLink: Handlebars.compile(document.querySelector('#template-author-right-link').innerHTML),
  };

  const opt = {
    articleSelector: '.post',
    titleSelector: '.post-title',
    titleListSelector: '.titles',
    articleTagsSelector: '.post-tags .list',
    articleAuthorSelector: '.post .post-author',
    tagsListSelector: '.tags.list',
    cloudClassCount: 5,
    cloudClassPrefix: 'tag-size-',
    authorsListSelector: '.authors',
  };
  
  const titleClickHandler = function(event) {
    event.preventDefault();
    const clickedElement = this;
    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for(let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }
    /* [DONE] add class 'active' to the clicked link */ 
    clickedElement.classList.add('active');
    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');
    for(let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }
    /* [DONE] get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);
    /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };

  function generateTitleLinks(customSelector = '') {
    /* [DONE] remove contents of titleList */
    const titleList = document.querySelector(opt.titleListSelector);
    titleList.innerHTML = '';
    /* [DONE] for each article */
    const articles = document.querySelectorAll(opt.articleSelector + customSelector);
    let html = '';
    for (let article of articles) {
      /* [DONE] get the article id */
      const articleId = article.getAttribute('id');
      /* [DONE] find the title element */
      const titleElement = article.querySelector(opt.titleSelector);
      /* [DONE] get the title from the title element */
      const articleTitle = titleElement.innerHTML;
      /* [DONE] create HTML of the link */
      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);
      /* [DONE] insert link into titleList */
      html = html + linkHTML;
    }   
    titleList.innerHTML = html;
    const links = document.querySelectorAll('.titles a');
    for(let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  }
  generateTitleLinks();

  function calculateTagsParams(tags) {
    const params = {
      max: 0,
      min: 999999
    };
    for(let tag in tags) {
      if(tags[tag] > params.max) {
        params.max = tags[tag];
      } else if (tags[tag] < params.min) {
        params.min = tags[tag];
      }
      //console.log(tag + ' is used ' + tags[tag] + ' times');
    }
    return params;
  }
  
  
  function calculateTagClass(count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor( percentage * (opt.cloudClassCount - 1) + 1 );
    return opt.cloudClassPrefix + classNumber;
  }

  
  function generateTags() {
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};
    /* find all articles */
    const articles = document.querySelectorAll(opt.articleSelector);  
    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find tags wrapper */
      const tagList = article.querySelector(opt.articleTagsSelector);
      /* make html variable with empty string */
      let html = '';
      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');  
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');  
      /* START LOOP: for each tag */
      for(let tag of articleTagsArray) {
        /* generate HTML of the link */
        const tagHTMLData = {id: tag, tag: tag};
        const tagHTML = templates.tagLink(tagHTMLData);
        /* add generated code to html variable */
        html = html + tagHTML;
        /* [NEW] check if this link is NOT already in allTags */
        if(!allTags[tag]) {
        /* [NEW] add tag to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
        /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      tagList.innerHTML = html;
    /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(opt.tagsListSelector);
    //console.log(tagList);
    /* [NEW] create variable for all links HTML code */
    const tagsParams = calculateTagsParams(allTags);
    //console.log('tagsParams:', tagsParams);
    const allTagsData = {tags: []};
    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags) {
    /* [NEW] generate code of a link and add it to allTagsHTML */
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
      //console.log(allTagsHTML);
    /* [NEW] END LOOP: for each tag in allTags: */
    }
    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
    //console.log(allTagsData);
  }    
  generateTags();
  
  function tagClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;  
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    //console.log(href);
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* find all tag links with class active */
    const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    /* START LOOP: for each active tag link */
    for (let tagLink of tagLinks) {
      /* remove class active */
      tagLink.classList.remove('active');
    /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const hrefTagLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for(let hrefTagLink of hrefTagLinks) {
      /* add class active */
      hrefTagLink.classList.add('active');
    /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }
  
  
  function addClickListenersToTags() {
    /* find all links to tags */
    const linkToTags = document.querySelectorAll('a[href^="#tag-"]');
    /* START LOOP: for each link */
    for(let linkToTag of linkToTags) {
      /* add tagClickHandler as event listener for that link */
      linkToTag.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
    }
  }
  
  addClickListenersToTags();

  function generateAuthors() {
    let allAuthors = {};
    /* find all articles */
    const articles = document.querySelectorAll(opt.articleSelector);  
    /* START LOOP: for every article: */
    for(let article of articles) {
      /* find tags wrapper */
      const authorWrapper = article.querySelector(opt.articleAuthorSelector);
      /* make html variable with empty string */
      let html = '';
      /* get authors from data-authors attribute */
      const authorTags = article.getAttribute('data-author');  
      /* generate HTML of the link */
      const authorHTMLData = {id: authorTags, author: authorTags};
      const tagHTML = templates.authorLink(authorHTMLData);
      /* add generated code to html variable */
      html = html + tagHTML;
      /* [NEW] check if this link is NOT already in allAuthors */
      if (!allAuthors[authorTags]) {
        allAuthors[authorTags] = 1;
      } else {
        allAuthors[authorTags]++;
      } 
      /* insert HTML of all the links into the tags wrapper */
      authorWrapper.innerHTML = html;
    }
    /* [NEW] find list of tags in right column */
    const authorList = document.querySelector(opt.authorsListSelector);
    //console.log(authorList);
    const allAuthorsData = {authors: []};
    /* [NEW] START LOOP: for each author in allAuthors: */
    for (let author in allAuthors) {
    /* [NEW] generate code of a link and add it to allAuthorsHTML */
      allAuthorsData.authors.push({
        id: author,
        name: author,
        count: allAuthors[author],
      });
    }
    /*[NEW] add HTML from allAuthorsHTML to authorList */
    authorList.innerHTML = templates.authorRightLink(allAuthorsData);
    console.log(allAuthorsData);
  }   
  generateAuthors();

  
  function authorClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;  
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "author" and extract tag from the "href" constant */
    const author = href.replace('#', '');
    /* find all tag links with class active */
    const tagLinks = document.querySelectorAll('.post .post-author a.active');
    /* START LOOP: for each active tag link */
    for(let tagLink of tagLinks) {
      /* remove class active */
      tagLink.classList.remove('active');
    /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const hrefTagLinks = document.querySelectorAll('.post .post-author a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for(let hrefTagLink of hrefTagLinks) {
      /* add class active */
      hrefTagLink.classList.add('active');
    /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  }
  
  
  function addClickListenersToAuthors() {
    /* find all links to tags */
    const linkToTags = document.querySelectorAll('.post .post-author a[href^="#"]');
    /* START LOOP: for each link */
    for(let linkToTag of linkToTags) {
      /* add tagClickHandler as event listener for that link */
      linkToTag.addEventListener('click', authorClickHandler);
    /* END LOOP: for each link */
    }
  }
  
  addClickListenersToAuthors();

  function authorRightClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;  
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "author" and extract tag from the "href" constant */
    const author = href.replace('#', '');
    /* find all tag links with class active */
    const authorLinks = document.querySelectorAll('.sidebar .authors a.active');
    /* START LOOP: for each active tag link */
    for(let authorLink of authorLinks) {
      /* remove class active */
      authorLink.classList.remove('active');
    /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const hrefAuthorLinks = document.querySelectorAll('.sidebar .authors a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for(let hrefAuthorLink of hrefAuthorLinks) {
      /* add class active */
      hrefAuthorLink.classList.add('active');
    /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  }

  function addClickListenersToRightAuthors() {
    /* find all links to tags */
    const linkToAuthors = document.querySelectorAll('.sidebar .authors a[href^="#"]');
    /* START LOOP: for each link */
    for (let linkToAuthor of linkToAuthors) {
      /* add tagClickHandler as event listener for that link */
      linkToAuthor.addEventListener('click', authorRightClickHandler);
    /* END LOOP: for each link */
    }
  }
  
  addClickListenersToRightAuthors();
}
