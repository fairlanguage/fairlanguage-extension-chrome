/* eslint-disable import/first */
// eslint-disable-next-line no-underscore-dangle
const __DEV__ = true;
import log from '../helpers/helper-logger';

const l = i => (__DEV__ ? log(i) : null); 

/**
 * Identify known container/wrapper type
 * 
 * There are three input elements on twitter's web app:
 * 
 * 1. 'main': The main tweet box in the timeline
 * (attribute: class="timeline-tweetbox")
 * 2. 'reply': Modal popping up when clicking 'reply' on a tweet in the timeline 
 * (attribute: class="modal-tweet-form-container")
 * 3. 'retweet': Modal popping up when clicking 'retweet' on a tweet in the timeline 
 * (attribute: class="RetweetDialog-commentBox")
 * 4. 'message' : Modal popping up when clicking 'Direct message' on a tweet in the timeline 
 * (attribute: class="DMActivity-container")
 */

const identifyInputElement = (elementClickedOn) => {

  let type;

  /*
    Find known container/wrapper element
  */
  
  let i = 0;
  let container;
  let current = elementClickedOn;

  const THRESHOLD = 25;

  while (container === undefined && i < THRESHOLD) {
    l(i);
    if (current.className) {
      switch (current.className) {
        case 'timeline-tweet-box':
          container = current;
          type = 'main';
          break;
        case 'modal-tweet-form-container':
          container = current;
          type = 'reply';        
          break;
        case 'RetweetDialog-commentBox':
          container = current;
          type = 'retweet';        
          break;
        case 'DMActivity-container':
          container = current;
          type = 'message';        
          break;
        default:
          type = undefined;
      }
    }

    if (!current.parentNode) container = null;
    
    current = current.parentNode;
    i += 1;
  }

  l(`container: ${container}`);

  switch (type) {

    case 'message': {

      const widgetContainer = document.createElement('span');

      widgetContainer.className = 'TweetBoxExtras-item';

      // widgetContainer.style.position = 'absolute';
      // widgetContainer.style.right = '0px';
      widgetContainer.style.marginRight = '15px';
      widgetContainer.style.marginLeft = '7.5px';

      widgetContainer.style.display = 'inline-flex';
      widgetContainer.style.alignItems = 'center';
      widgetContainer.style.justifyContent = 'center';

      const tweetBoxExtrasElement = container.querySelectorAll('div[class="TweetBoxExtras"]')[0];
      tweetBoxExtrasElement.style.display = 'flex';
      tweetBoxExtrasElement.style.alignItems = 'center';
      tweetBoxExtrasElement.style.justifyContent = 'center';
      
      tweetBoxExtrasElement.insertBefore(widgetContainer, tweetBoxExtrasElement.childNodes[0]);

      const inputElement = container.querySelectorAll('div[id="tweet-box-dm-conversation"]')[0];

      return [inputElement, widgetContainer];

    }

    case 'retweet': {

      const widgetContainer = document.createElement('span');

      widgetContainer.className = 'TweetBoxExtras-item';

      widgetContainer.style.left = '6px';
      widgetContainer.style.marginRight = '15px';
      widgetContainer.style.marginTop = '3.5px';

      widgetContainer.style.display = 'inline-flex';
      widgetContainer.style.alignItems = 'center';
      widgetContainer.style.justifyContent = 'center';

      /* const tweetBoxExtrasElement = container.querySelectorAll('div[class="TweetBoxExtras tweet-box-extras"]')[0];
      tweetBoxExtrasElement.insertBefore(widgetContainer, tweetBoxExtrasElement.childNodes[0]); */

      container.append(widgetContainer);

      const inputElement = container.querySelectorAll('div[id="retweet-with-comment"]')[0];

      return [inputElement, widgetContainer];

    }

    case 'reply': {

      const widgetContainer = document.createElement('span');

      widgetContainer.className = 'TweetBoxExtras-item';

      widgetContainer.style.left = '6px';
      widgetContainer.style.marginRight = '15px';
      widgetContainer.style.top = '-5px';

      widgetContainer.style.display = 'inline-flex';
      widgetContainer.style.alignItems = 'center';
      widgetContainer.style.justifyContent = 'center';

      const tweetBoxExtrasElement = container.querySelectorAll('div[class="TweetBoxExtras tweet-box-extras"]')[0];
      tweetBoxExtrasElement.insertBefore(widgetContainer, tweetBoxExtrasElement.childNodes[0]);

      const inputElement = container.querySelectorAll('div[id="tweet-box-global"]')[0];

      return [inputElement, widgetContainer];

    }
    case 'main': {

      const widgetContainer = document.createElement('span');

      widgetContainer.className = 'TweetBoxExtras-item';

      widgetContainer.style.left = '6px';
      widgetContainer.style.marginRight = '15px';
      widgetContainer.style.top = '-6px';

      widgetContainer.style.display = 'inline-flex';
      widgetContainer.style.alignItems = 'center';
      widgetContainer.style.justifyContent = 'center';

      /**
       * Find input element inside this element (attribute: id="tweet-box-home-timeline")
       */
        
      const tweetBoxExtrasElement = container.querySelectorAll('div[class="TweetBoxExtras tweet-box-extras"]')[0];
      tweetBoxExtrasElement.insertBefore(widgetContainer, tweetBoxExtrasElement.childNodes[1]);

      const inputElement = container.querySelectorAll('div[id="tweet-box-home-timeline"]')[0];

    
      return [inputElement, widgetContainer];
    
    }

    default:

      log(`[Twitter] - disabled on this identifiedInputElementType: ${type}`);

      return [null, null];

  }

};

const formatTextElements = (originalTextElement, clonedTextElement) => {
  originalTextElement.style.top = '0px';
  originalTextElement.style.minWidth = '100px';

  clonedTextElement.addEventListener('click', () => {
    originalTextElement.focus();
  });
  
  clonedTextElement.addEventListener('focus', () => {
    originalTextElement.focus();
  });

  clonedTextElement.setAttribute('data-attachment-placeholder', '');
};

const onKeyDown = (originalTextElement, clonedTextElement) => {
  clonedTextElement.setAttribute('data-attachment-placeholder', '');
};

const formatMarkingElement = (markingElement) => {
  
};

export default identifyInputElement;
export { formatMarkingElement, formatTextElements, onKeyDown };
