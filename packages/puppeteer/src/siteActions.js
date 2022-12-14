// https://devhints.io/xpath

const defaultDelay = 2500;
const defaultPostDelay = 1000;
const defaultWidth = 820;

const siteActions = [
  {
    name: "dailymail.co.uk",
    clicks: ["//button[text()='Got it']", "//div[@id='smartBanner']/a", "//div[@id='closeButton']"],
    removes: [
      "//div[@id='chromelessPlayer']",
      "//div[@id='vjs_video_3']",
      "//div[contains(@class,'billboard-container')]",
    ],
    delay: 3500,
    retryCount: 2,
    // postDelay: 3000,
    scrolls: [500, 1000, 0],
    width: 980,
  },
  {
    name: "independent.co.uk",
    clicks: [
      "//button[contains(@class,'sticky-ad-close-button-press')]",
      "//button[contains(@class,'pn-template__close')]",
      "//div[@aria-label='Close']",
    ],
    removes: [
      "//div[@id='stickyFooterRoot']",
      "//div[child::div[child::div[@data-tile-name='top_banner']]]",
      // "//div[contains(@class,'tp-modal')][child::div[child::iframe]]",
    ],
    width: 768,
    delay: 3000,
    postDelay: 3000,
    retryCount: 3,
  },
  {
    name: "mirror.co.uk",
    clicks: ["//button/span[text()='I accept']"],
    removes: [
      "//reach-billboard[contains(@class,'ad-placeholder--top')]",
      "//reach-billboard[contains(@class,'ad-placeholder--bottom')]",
      "//div[@id='takeover']",
    ],
    delay: 4000,
    width: 832,
  },
  {
    name: "telegraph.co.uk",
    removes: [
      "//div[contains(@class,'martech-footer-overlay')]",
      "//div[@id='advert_tmg_ban']",
      "//div[contains(@class,'martech-modal-component-overlay')]",
      "//div[contains(@class,'subscribe-banner')]",
    ],
    delay: 4000,
  },
  {
    name: "thesun.co.uk",
    removes: ["//div[contains(@class,'billboard')]"],
    styles: [{ xpath: "//div[contains(@class,'sun-header-bg')]", value: { animation: "none" } }],
    width: 700,
    postDelay: 3000,
  },
  {
    name: "theguardian.com",
    removes: [
      "//div[contains(@class,'site-message--banner')]",
      "//gu-island[@name='StickyBottomBanner']",
      "//div[contains(@class,'top-banner-ad-container')]",
    ],
    width: 980,
    tabletWidth: 740,
    desktopWidth: 980,
  },
  {
    name: "ft.com",
    clicks: ["//a[contains(.,'Accept & continue')]", "//button[contains(@class,'o-banner__close')]"],
    removes: ["//div[@data-o-ads-name='top-desktop']"],
    width: 820,
    desktopWidth: 1024,
  },
  {
    name: "bbc.com",
    clicks: [
      "//button/p[text()='Consent']",
      "//button/span[text()='Yes, I agree']",
      "//button[contains(@class,'tp-close')]",
    ],
    removes: ["//section[contains(@class,'module--leaderboard')]"],
  },
  {
    name: "news.sky.com",
    clicks: [],
    removes: [
      "//div[contains(@class,'sdc-site-au__leaderboard')]",
      "//div[contains(@class,'sdc-site-au')][@data-ad-format='leaderboard']",
    ],
  },
  {
    name: "politico.eu",
    clicks: [],
    removes: ["//div[contains(@class,'ad__leaderboard')]", "//div[@class='block-collection has-first-leaderboard']"],
  },
  {
    name: "washingtonpost.com",
    clicks: ["//button[text()='I accept']", "//button[text()='Got it']", "//button[@aria-label='close']"],
    removes: ["//wp-ad[@id='slug_leaderboard_1']", "//div[contains(@class,'adslot-c')]"], //, "//div[contains(@class,'video-live-bar')]"],
    styles: [{ xpath: "//main[@id='main-content']", value: { "margin-top": "32px" } }],
    retryCount: 2,
    delay: 4000,
    width: 900,
  },
  {
    name: "nytimes.com",
    clicks: ["//button[text()='Accept']" /*, "//button[@aria-label='next slide']" */],
    removes: [
      "//div[child::div[child::div[child::div[child::div[@data-testid='StandardAd']]]]]",
      "//div[child::div[child::div[@data-testid='response-snackbar']]]",
      "//div[child::div[child::div[@data-testid='StandardAd'][child::div[contains(@class,'dfp-ad-top-wrapper')]]]]",
    ],
  },
  {
    name: "edition.cnn.com",
    clicks: ["//button[text()='Accept All']"],
    removes: ["//div[@id='header-wrap']"],
    delay: 3000,
    retryCount: 2,
    width: 960,
  },
  { name: "foxnews.com", clicks: ["//div[@aria-label='Close']"], removes: ["//div[contains(@class,'ad-container')]"] },
  {
    name: "wsj.com",
    removes: ["//div[@id='cx-candybar']", "//div[child::div[@id='wrapper-AD_PUSH']]"],
    styles: [
      { xpath: "//div[contains(@class,'WSJTheme--margin-bottom')]", value: { "margin-bottom": "0" } },
      { xpath: "//div[contains(@class,'style--padding-top-large')]", value: { "border-top": "none" } },
    ],
    width: 980,
    delay: 4000,
    postDelay: 3000,
  },
  {
    name: "apnews.com",
    clicks: ["//button[text()='Accept All Cookies']"],
    removes: ["//div[contains(@class,'Leaderboard')]"],
    delay: 4000,
    desktopWidth: 1025,
  },
  {
    name: "vox.com",
    clicks: ["//button[@id='privacy-consent-button']", "//button[contains(@class,'c-breaking-news__close')]"],
    removes: [
      "//div[@data-concert-ads-name='desktop_leaderboard_variable']",
      "//div[contains(@aria-labelledby,'heading-podcast-breaker-title')]",
    ],
    styles: [{ xpath: "//main[@id='content']", value: { "margin-top": "32px" } }],
  },
  {
    name: "eu.usatoday.com",
    clicks: ["//button[text()='Accept All']"],
    removes: ["//partner-high-impact[contains(@class,'spacer-large')]"],
    desktopWidth: 960,
  },
  { name: "latimes.com", clicks: ["//button[text()='Close']"] },
  {
    name: "cnbc.com",
    clicks: ["//button[text()='I Accept']"],
    removes: ["//div[child::div[child::div[contains(@class,'TopBanner-container')]]]"],
    delay: 5000,
    retryCount: 2,
    // postDelay: 4000,
    desktopWidth: 1020,
    // scrolls: [500, 0],
    width: 1020,
  },
  {
    name: "bloomberg.com",
    removes: ["//div[contains(@class,'canopy-container')]"],
    width: 780,
    desktopWidth: 1020,
  },
  {
    name: "nbcnews.com",
    clicks: ["//button[text()='CONTINUE']"],
    removes: ["//div[contains(@class,'header-and-footer--banner-ad')]"],
    desktopWidth: 1000,
  },
  {
    name: "newsweek.com",
    width: 992,
    desktopWidth: 992,
  },
  {
    name: "reuters.com",
    clicks: ["//button[text()='Accept All']"],
    removes: [
      "//div[contains(@class,'leaderboard__slot-container')]",
      "//div[@id='ot-sdk-btn-floating']",
      "//a[@data-testid='Button'][child::span[child::span[text()='Skip to main content']]]",
    ],
    desktopWidth: 1024,
  },
  {
    name: "vanityfair.com",
    clicks: [],
    removes: ["//div[@id='onetrust-consent-sdk']", "//div[contains(@class,'ad-stickyhero')]"],
    width: 1024,
    desktopWidth: 1024,
  },
  {
    name: "deadline.com",
    clicks: ["//button[text()='Accept All']"],
    removes: ["//div[contains(@class,'above-header-ad')]", "//a[text()='Skip to main content']", "//div[@id='pmc-adm-interrupts-container']"],
    postDelay: 4000,
    width: 1000,
    desktopWidth: 1000,
  },
  {
    name: "hbl.fi",
    clicks: ["//button/p[text()='Jag godk??nner']"],
    removes: ["//div[contains(@class,'mosaico-ad__parade')]", "//div[contains(@class,'mosaico-ad__top-parade')]"],
    desktopWidth: 1000,
  },
  {
    name: "hs.fi",
    clicks: ["//button[text()='OK']"],
    removes: ["//div[@data-ad-position='top']"],
    // delay: 4000,
    // postDelay: 4000,
    // scrolls: [500, 0],
    width: 780,
  },
  {
    name: "bt.dk",
    clicks: ["//button[text()='Tillad alle']"],
    removes: ["//div[contains(@class,'topbanner-desktop')]"],
  },
  {
    name: "ekstrabladet.dk",
    clicks: ["//button[text()='Tillad alle']", "//div[contains(@class,'adnm-scroll-down-btn')]"],
    removes: ["//div[@id='ebbanner_megaboard_top']"],
    retryCount: 2,
    scrolls: [500, 1000, 0],
    width: 940,
  },
  {
    name: "politiken.dk",
    clicks: [
      "//button[text()='Tillad alle']",
      "//div[@id='topscroll']/div[2]",
      "//div[contains(@class,'adnm-scroll-down-btn')]",
      "//a[text()='Fortryd']",
    ],
    removes: [
      "//div[contains(@class,'sticky-bottom')]",
      "//div[contains(@class,'ad--horseshoe')]",
      "//anchor[contains(@class,'sleeknote-anchor')]",
    ],
    delay: 3500,
    retryCount: 2,
    width: 960,
  },
  { name: "berlingske.dk", clicks: ["//button[text()='Tillad alle']"] },
  {
    name: "lemonde.fr",
    clicks: ["//button[text()='Accept']", "//button[contains(.,'Accepter et continuer')]"],
    removes: ["//div[@id='banniere_haute']"],
    width: 770,
  },
  {
    name: "lefigaro.fr",
    clicks: ["//div[@id='appconsent']/iframe | //span[text()='Accept all']", "//button[@title='Fermer le bandeau']"],
    removes: ["//div[contains(@class,'fig-ad-content')]"],
  },
  {
    name: "france24.com",
    clicks: ["//button[@id='didomi-notice-agree-button']", "//button[contains(@class,'a-close-button')]"],
    removes: ["//div[contains(@class,'o-ad-container--banner-top')]"],
  },
  {
    name: "telegraaf.nl",
    clicks: ["//button[@id='didomi-notice-agree-button']", "//button[text()='Ja, prima!']"],
    removes: [
      "//div[contains(@class,'SectionPage__bannerWrapper--position-0')]",
      "//div[contains(@class,'MainCuratedTeasersLayout__banner')]",
    ],
    retryCount: 2,
  },
  {
    name: "ad.nl",
    removes: ["//div[contains(@class,'advertising-container-top')]", "//anchor[contains(@class,'sleeknote-anchor')]"],
    postDelay: 6000,
    // waitForNavigation: true,
  },
  {
    name: "corriere.it",
    clicks: [
      "//iframe[@id='_cpmt-iframe'] | //button[text()='Agree']",
      "//button[@aria-label='Close']",
      "//div[@id='introDfp_close']",
      "//button[@id='privacy-cor-wall-accept']",
    ],
    removes: ["//div[@id='rcsad_Position7']", "//div[@id='rcsad_TopLeft_wrapper']"],
    styles: [{ xpath: "//header[@id='l-header']", value: { "margin-bottom": "0" } }],
    retryCount: 2,
    // postDelay: 6000,
    width: 1024,
    // waitForNavigation: true,
  },
  {
    name: "repubblica.it",
    clicks: ["//button[text()='Accetta']"],
    removes: ["//div[@id='adv-TopLeft']", "//div[child::a[child::div[@id='adv_Skin']]]", "//div[@id='adv-BoxP']"],
    styles: [
      // { xpath: "//div[@id='adv-TopLeft']", value: { display: "none !important" } },
      // { xpath: "//div[@class='gd-row'][1]", value: { "max-height": "42px" } },
      // { xpath: "//div[@class='block__item']/article[contains(@class,'entry')]", value: { "margin-bottom": "0px" } },
    ],
  },
  {
    name: "lastampa.it",
    clicks: ["//button[text()='Accetta']"],
    removes: ["//div[@id='adv-TopLeft']", "//div[@id='adv-Middle1-hr']"],
  },
  {
    name: "gazzetta.it",
    clicks: [
      "//iframe[@id='_cpmt-iframe'] | //button[text()='Agree']",
      "//div[@id='closeBtnP7']",
      "//p[text()='CHIUDI']",
      "//a[@id='clickEventDmp']",
    ],
    removes: [
      "//div[@class='wrapper is-paddingless']",
      "//div[@id='rcsad_TopLeft_container']",
      "//div[contains(@id,'rcsad_Position')]",
      "//div[@class='bck-adv'][@id='rcsad_Frame2_container']",
      "//div[contains(@class,'fxc-top-right')]/div[contains(@class,'sticky-top')]/div[@class='bck-adv'][1]",
      "//aside[@class='column is-4']/div[contains(@class,'fxc-top-right')][child::div[not(*)]]",
      "//aside[@class='column is-4']/div[contains(@class,'fxc-top-right')][child::div[contains(@class,'sticky-container-bottom')][child::div[@class='bck-adv']]]",
      // "//div[contains(@class,'fxc-top-right')][child::div[contains(@class,'sticky-top')][child::div[@class='bck-adv']]]",
      // "//aside[@class='column is-4']/div[contains(@class,'fxc-top-right')][child::div[contains(@class,'sticky-container-bottom')]]",
      // "//aside[@class='column is-4']/div[contains(@class,'fxc-top-right')][child::div[contains(@class,'sticky-top')]]",
      // "//aside[@class='column is-4']/div[contains(@class,'fxc-top-right')][3]",
      // "//aside[@class='column is-4']/div[contains(@class,'fxc-top-right')][2]"
    ],
    styles: [{ xpath: "//header[@id='l-header']", value: { "margin-bottom": "8px" } }],
    delay: 4000,
    // postDelay: 4000,
    retryCount: 2,
    // scrolls: [1000, 0],
    width: 1024,
  },
  {
    name: "protothema.gr",
    clicks: ["//button[text()='??????????????']"],
    removes: ["//section[@class='section bannerWrp']", "//section[@class='section featImg']"],
    delay: 4000,
  },
  {
    name: "publico.pt",
    clicks: ["//button[child::span[text()='CONCORDO']]"],
    removes: ["//div[contains(@class,'site-message--paywall')]"],
  },
  {
    name: "dailysabah.com",
    clicks: ["//a[@id='CybotCookiebotDialogBodyButtonAccept']"],
    removes: ["//div[@class='row'][child::div[child::div[contains(@class,'ad_holder')]]]"],
    styles: [
      {
        xpath: "//div[contains(@class,'sabah-fourth-main')]/div/div[contains(@class,'main_block')]",
        value: { "margin-bottom": "20px" },
      },
      {
        xpath:
          "//div[contains(@class,'row')]/div/div[contains(@class,'main_block')][contains(@class,'sabah-four-articles')]",
        value: { "margin-bottom": "20px" },
      },
    ],
    retryCount: 2,
    width: 992,
  },
  {
    name: "hurriyetdailynews.com",
    clicks: ["//p[text()='??zin ver']", "//div[@id='scrollclose']"],
    removes: [
      "//div[@class='row'][child::div[child::div[contains(@class,'advMasthead')]]]",
      "//div[@class='row'][child::div[child::div[contains(@class,'advertorial-interstitial-oop')]]][1]",
    ],
    styles: [
      {
        xpath: "//body/div[@class='container']",
        value: { "padding-top": "24px" },
      },
    ],
    delay: 3500,
    retryCount: 2,
    width: 992,
  },
  {
    name: "globo.com",
    clicks: ["//button[text()='PROSSEGUIR']"],
    removes: ["//div[@id='banner_home1_t_container']"],
    styles: [
      {
        xpath: "//section[contains(@class,'highlight-container')]/div[contains(@class,'area-destaque')]/div[1]",
        value: { "padding-top": "12px" },
      },
    ],
  },
  {
    name: "lanacion.com.ar",
    clicks: ["//p[text()='ACEPTAR']"],
    removes: ["//div[@class='container --ads']"],
  },
  {
    name: "eluniversal.com.mx",
    clicks: ["//button[text()='Acepto']"],
    removes: [
      "//div[@id='dfp-top']",
      "//div[@id='dfp-ad-portada_desk_bottom1-wrapper']",
      "//div[@id='dfp-ad-portada_takeover-wrapper']",
    ],
    retryCount: 2,
    // delay: 4000,
    // postDelay: 8000,
    scrolls: [500, 0],
  },
  {
    name: "ekathimerini.com",
    clicks: ["//button[text()='AGREE']"],
    removes: [],
  },
  {
    name: "themoscowtimes.com",
    clicks: ["//button[child::span[text()='AGREE']]"],
    removes: [
      "//div[contains(@class,'contribute-modal')]",
      "//div[contains(@class,'fs-sticky-footer')]",
      "//div[@y-name='banner']",
    ],
    width: 880,
  },
  {
    name: "english.pravda.ru",
    clicks: ["//p[text()='Consent']", "//button[text()='Accept']", "//button[@class='via-close']"],
    removes: ["//div[@class='header section']", "//div[contains(@class,'via-slider')]"],
    delay: 4000,
    retryCount: 2,
    width: 1024,
  },
  {
    name: "meduza.io",
    clicks: ["//button[@class='GDPRPanel-dismiss']"],
    removes: ["//div[@class='Layout-bannerTop']"],
    width: 1024,
  },
  { name: "vg.no", removes: ["//div[@id='advert-topboard']"], width: 1010 },
  { name: "dagbladet.no", clicks: ["//button[text()='Jeg forst??r']"], removes: ["//div[@id='ad-topbanner1']"] },
  {
    name: "aftenposten.no",
    removes: [
      "//div[@id='topboard']",
      "//div[@id='top-ads-container']",
      "//div[@id='push-down-banner']",
      "//div[@id='stripe-wrapper']",
      "//div[child::div[child::article[contains(@class,'brandstudio-premium-content-widget')]]]",
      "//div[contains(@class,'sch-datacontroller--footer')]",
    ],
  },
  {
    name: "nettavisen.no",
    clicks: [
      "//button[text()='OK ??? jeg forst??r']",
      "//amedia-privacybox-button[@class='lp_privacy_ok']",
      "//div[contains(@class,'takeover-close')]",
    ],
    removes: ["//div[contains(@class,'maelstrom-topbanner')]", "//div[@id='front2']", "//amedia-privacybox"],
  },
  {
    name: "finansavisen.no",
    clicks: ["//a[text()='OK, jeg forst??r!']"],
    removes: ["//div[@data-banner]"],
    styles: [{ xpath: "(//div[contains(@class,'o-layout')])[2]", value: { display: "none" } }],
    delay: 3500,
  },
  {
    name: "dn.no",
    clicks: [
      "//button[@id='onetrust-accept-btn-handler'][text()='OK, Skj??nner']",
      "//div[contains(@class,'adnm-scroll-down-btn')]",
    ],
    removes: [
      "//div[@id='googlead-toppbanner']",
      "//div[child::div[child::div[@data-placeholder='lantern_placeholder_subscriber-engagement']]]",
    ],
    retryCount: 2,
    styles: [
      {
        xpath: "//div[contains(@class,'front')]/div[contains(@class,'dre-group')][1]",
        value: { "margin-top": "20px" },
      },
    ],
    scrolls: [200, 0],
    width: 1012,
  },
  {
    name: "zeit.de",
    clicks: ["//button[contains(@class,'paywall-footer__btn-close')]"],
    removes: ["//div[@data-ct-area='topnav-sticky']"],
    delay: 4000,
    desktopWidth: 1004,
  },
  {
    name: "bild.de",
    clicks: ["//a[text()='OK, jeg forst??r!']"],
    removes: ["//div[contains(@class,'inactivity__wrapper')]", "//div[@id='superbannerWrapper']"], //, "//div[contains(@class,'o-layout')]"],
    width: 1024,
  },
  {
    name: "t-online.de",
    removes: [
      "//section[@data-testid='InactivityLayer.ModalView']",
      "//div[child::div[child::div[@data-commercial-format='banner']]]",
    ],
    postDelay: 4000,
    width: 1048,
  },
  {
    name: "spiegel.de",
    clicks: ["//button[@aria-label='Schlie??en']"],
    removes: ["//div[@id='wallpaper_1']", "//div[contains(@data-advertisement,'superbanner_2')]"],
    styles: [
      { xpath: "//div[child::main[@id='Inhalt']]", value: { background: "white" } },
      {
        xpath:
          "//div[contains(@class,'OffsetContainer')]/div[contains(@class,'md:max-w-md')]/div[contains(@class,'md:h-8')]",
        value: { background: "white" },
      },
      { xpath: "//article/div/div[contains(@class,'md:h-24')]", value: { background: "white" } },
    ],
  },
  {
    name: "dw.com",
    clicks: ["//a[contains(@class,'cookie__btn--ok')]", "//div[@role='button'][child::span[text()='OK']]"],
    removes: [
      "//div[@id='accesstobeta']",
      "//div[@id='innerFrame']/div[contains(@class,'adsContainer')]",
      "//div[contains(@class,'advertisement')][child::div[@id='dw_t_overview_top']]",
      "//div[child::div[child::span[text()='Welcome to the new DW website!']]]",
    ],
    delay: 4000,
    width: 980,
  },
  {
    name: "tagesspiegel.de",
    clicks: [],
    removes: ["//div[child::div[@id='iqadtile1']]"],
  },
  {
    name: "aftonbladet.se",
    clicks: [
      "//button/img[@alt='St??ng']",
      "//span[text()='TILL AFTONBLADET']",
      "//img[@alt='Scrolla ner till Aftonbladet']",
      "//button/img[@alt='St??ng annonsen']",
    ],
    removes: ["//div[contains(@class,'page-layout-supertop')]"],
    retryCount: 2,
  },
  {
    name: "expressen.se",
    clicks: [
      "//button[@id='didomi-notice-agree-button']",
      "//button[contains(@class,'campaign__close')]",
      "//span[contains(@class,'fullpage-ad__close')]",
      "//button[contains(@class,'tapet-close-button')]",
    ],
    removes: ["//div[@data-slot-name='panorama']"],
    postDelay: 3000,
    width: 1016,
  },
  {
    name: "gp.se",
    clicks: [
      "//input[@value='Jag f??rst??r']",
      "//div[contains(@class,'dy-lb-close')]",
      "//div[contains(@class,'adnm-scroll-down-btn')]",
      "//div[contains(@class,'adnm-topscroll-text')]",
    ],
    removes: [
      "//div[@data-key='adl--stage']",
      "//div[@id='panorama_1']",
      "//div[@id='panorama_grid_2']",
      "//div[contains(@class,'dy_full_width_notifications_container')]",
      "//div[contains(@class,'adform-adbox-fixed')]",
    ],
    styles: [{ xpath: "//main[contains(@class,'o-grid__main')]", value: { "margin-top": "16px" } }],
    retryCount: 2,
  },
  {
    name: "dn.se",
    clicks: ["//button[@id='didomi-notice-agree-button']", "//button[@aria-label='St??ng']"],
    removes: ["//div[contains(@class,'ad--panorama')]", "//div[@id='rich-media-ads']"],
    postDelay: 3000,
    width: 1024,
  },
  {
    name: "di.se",
    // cookies: [{ domain: "www.di.se", name: "channel", value: "tablet" }],
    clicks: [
      "//button[@id='didomi-notice-agree-button']",
      "//button[text()='Godk??nn och st??ng']",
      "//div[contains(@class,'ad-fullpage__info')]",
    ],
    removes: ["//div[contains(@class,'site-header__panorama')]"],
    retryCount: 2,
    postDelay: 4000,
    width: 1024,
  },
  {
    name: "svd.se",
    clicks: [
      "//*[contains(@class,'Notification-close-button')]",
      "//span[text()='G?? direkt till SvD']",
      "//button[contains(@class,'sch-datacontroller__btn-close')]",
    ],
    removes: [
      "//div[contains(@class,'Container--ad Container--ad-panorama')]",
      "//div[contains(@class,'Container')]/div[child::div[contains(@class,'above-scroll-ad')]]",
      "//div[contains(@class,'sch-datacontroller--footer')]",
    ],
    scrolls: [200, 0],
  },
  {
    name: "dagensnaringsliv.se",
    clicks: ["//button[text()='Jag godk??nner']"],
  },
  {
    name: "breakit.se",
    clicks: ["//button[text()='JAG GODK??NNER']", "//iframe[@aria-label='Advertisement'] | //div[@id='close-x']"],
    removes: ["//div[contains(@class,'Home_layout__topAds')]"],
    retryCount: 2,
    delay: 3000,
    width: 1000,
  },
  {
    name: "realtid.se",
    clicks: ["//button[contains(@class,'button-hide')]"],
    removes: ["//div[@id='cmpwrapper']", "//div[contains(@class,'realtid-add--header')]", "//triggerbee-widget"],
    width: 890,
  },
  {
    name: "resume.se",
    clicks: ["//button[@id='didomi-notice-agree-button']", "//p[contains(.,'Detta ??r en annons, vidare till')]"],
    removes: [
      "//div[child::div[@id='scope-panorama']]",
      "//div[child::div[@id='scope-module-1']]",
      "//div[contains(@class,'tippy-popper')]",
    ],
    retryCount: 2,
  },
  {
    name: "omni.se",
    removes: ["//div[contains(@class,'pre-banner')]", "//div[contains(@class,'banner--toppanorama')]"],
  },
  {
    name: "dagenssamhalle.se",
    clicks: ["//button[@id='didomi-notice-agree-button']"], // , "//span[@id='close']"
    removes: [
      "//div[contains(@class,'tippy-popper')]",
      "//div[child::div[@id='scope-panorama']]",
      "//div[child::div[@id='scope-module-1']]",
    ],
    retryCount: 2,
    postDelay: 3000,
    width: 960,
  },
  {
    name: "vk.se",
    clicks: [
      "//div[@id='gdpr-module-group-understand-button']",
      "//a[text()='St??ng annons']",
      "//button[contains(@class,'button-hide')]",
      "//div[contains(@class,'adnm-topscroll-text')]",
    ],
    removes: [
      "//div[@data-track-id='layout-item-0.panoramaAd']",
      "//div[contains(@class,'vkmui-FlexVerticalCentered')]",
    ],
    postDelay: 3000,
    width: 1024,
  },
  {
    name: "privataaffarer.se",
    clicks: ["//div[contains(.,'Acceptera alla')]"],
  },
  {
    name: "nyheter24.se",
    clicks: [
      "//p[text()='Jag samtycker']",
      "//button[@id='webpushes_pop_cancel']",
      "//div[contains(@class,'jpx-fi-close')]",
      "//a[@id='btn-close']",
      "//div[text()='Vidare till hemsidan nyheter24.se']",
      "//div[contains(@class,'adnm-scroll-down-btn')]",
    ],
    removes: ["//div[contains(@class,'advertisement')][contains(@class,'widescreen')]"],
    retryCount: 2,
    width: 980,
    desktopWidth: 1180,
  },
  {
    name: "sydsvenskan.se",
    clicks: ["//button[@id='didomi-notice-agree-button']", "//button[contains(@class,'ad-welcome__header')]"],
    removes: [
      "//div[contains(@class,'shelf--panorama')]",
      "//triggerbee-widget",
      "//header/div[contains(@class,'top-bar')]",
    ],
    styles: [
      { xpath: "(//div[contains(@class,'block--top')])", value: { "padding-top": "0" } },
      { xpath: "//article[contains(@class,'teaser--xxl')]", value: { "margin-bottom": "2.0rem" } },
    ],
  },
  {
    name: "dalademokraten.se",
    clicks: ["//button[@id='didomi-notice-agree-button']", "//button[contains(@class,'ad-welcome__header')]"], //,"//button[contains(@class,'button-hide')]"],
    removes: [
      "//div[contains(@class,'shelf--panorama')]",
      "//triggerbee-widget",
      "//header/div[contains(@class,'top-bar')]",
    ],
    styles: [
      { xpath: "//div[contains(@class,'block--top')]", value: { "padding-top": "0" } },
      { xpath: "//article[contains(@class,'teaser--xxl')]", value: { "margin-bottom": "2.0rem" } },
    ],
    width: 1000,
    desktopWidth: 1000,
  },
  {
    name: "hd.se",
    clicks: ["//button[@id='didomi-notice-agree-button']", "//button[contains(@class,'ad-welcome__header')]"],
    removes: [
      "//div[contains(@class,'shelf--panorama')]",
      "//triggerbee-widget",
      "//header/div[contains(@class,'top-bar')]",
    ],
    styles: [
      { xpath: "//div[contains(@class,'block--top')]", value: { "padding-top": "0" } },
      { xpath: "//article[contains(@class,'teaser--xxl')]", value: { "margin-bottom": "2.0rem" } },
    ],
    width: 1000,
    desktopWidth: 1000,
  },
  {
    name: "st.nu",
    clicks: ["//button[@id='didomi-notice-agree-button']", "//button[contains(@class,'ad-welcome__header')]"],
    removes: [
      "//div[contains(@class,'shelf--panorama')]",
      "//triggerbee-widget",
      "//header/div[contains(@class,'top-bar')]",
    ],
    styles: [
      { xpath: "//div[contains(@class,'block--top')]", value: { "padding-top": "0" } },
      { xpath: "//article[contains(@class,'teaser--xxl')]", value: { "margin-bottom": "2.0rem" } },
    ],
    width: 1000,
    desktopWidth: 1000,
  },
  {
    name: "e24.no",
    removes: ["//div[@id='ad-topboard']", "//div[contains(@class,'sch-datacontroller--footer')]"],
  },
  {
    name: "hallandsposten.se",
    clicks: [
      "//input[@value='Jag f??rst??r']",
      "//div[@text='Continue to hallandsposten.se']",
      "//div[contains(@class,'dy-lb-close')]",
      "//div[@id='closeBtn']",
    ],
    removes: [
      "//div[@id='panorama_1']",
      "//div[contains(@class,'adnm-scroll-down-btn')]",
      "//div[contains(@class,'adnm-html-topscroll-frame-wrapper')]",
    ],
    styles: [{ xpath: "//main[contains(@class,'o-grid__main')]", value: { "margin-top": "16px" } }],
    retryCount: 2,
  },
  {
    name: "sweclockers.com",
    clicks: ["//button[text()='Acceptera allt']"],
    removes: ["//div[@id='panorama-1']"],
  },
  {
    name: "idg.se",
    clicks: ["//button[text()='Godk??nn']"],
    postDelay: 7500,
  },
  {
    name: "nyteknik.se",
    clicks: ["//a/img[@alt='close']"], // "//button[contains(@class,'button-hide')]"],
    removes: [
      "//div[child::div[child::div[@id='nyteknik_desktop-panorama-mega']]]",
      "//triggerbee-widget",
      "//div[child::span[@data-set='panorama']]",
    ],
    retryCount: 2,
    delay: 3000,
    desktopWidth: 992,
  },
  {
    name: "svt.se",
    clicks: ["//button[text()='Acceptera alla']"],
  },
  {
    name: "corren.se",
    clicks: [
      "//div[contains(@class,'adnm-scroll-down-btn')]",
      "//div[text()='Continue to  corren.se']",
      "//div[@class='subscribe-footer-content-container']",
    ],
    removes: [
      "//iris-content-outlet/ad-block-2",
      "//div[@class='subscribe-footer-content-container']",
      "//iris-news-page-flex/ad-full-page-block",
    ],
    retryCount: 2,
    delay: 3000,
    width: 1029,
  },
  {
    name: "nzz.ch",
    clicks: ["//span[text()='Alle Akzeptieren']", "//span[@type='close'][@role='button']"],
    removes: ["//div[contains(@class,'resor--maxiboard')]", "//div[child::iframe[@data-test-id='banner-frame']]"],
  },
  {
    name: "20min.ch",
    clicks: ["//button[text()='Akzeptieren']"],
    removes: ["//*[child::div[@id='prime__inside-top']]", "//*[child::div[@id='default__outside-welcome']]"],
    delay: 4000,
  },
  {
    name: "elpais.com",
    clicks: ["//button[@id='didomi-notice-agree-button']", "//button/span[text()='Accept']"],
    removes: ["//div[contains(@class,'ad-giga-1')]"],
    styles: [
      {
        xpath: "//div[@id='ctn_head']",
        value: { "min-height": "9rem" },
      },
      {
        xpath: "//div[@class='x _pr x-nf _g x-p']",
        value: { padding: "0 0 2rem" },
      },
    ],
    width: 780,
  },
  {
    name: "mbl.is",
    clicks: ["//a[text()='Loka']"],
    removes: ["//div[contains(@class,'yfirhaus-ad')]", "//div[contains(@class,'ticker-ad')]"],
    styles: [
      {
        xpath: "//div[contains(@class,'main-header')]",
        value: { "margin-top": "0" },
      },
      {
        xpath: "//main",
        value: { "margin-top": "-20px" },
      },
    ],
    retryCount: 2,
    width: 780,
  },
  {
    name: "krone.at",
    clicks: ["//span[text()='Zustimmen & Weiter']"],
    removes: ["//div[contains(@class,'c_floating-player')]", "//div[contains(@class,'c_regio-anmod-overlay')]"],
    styles: [
      {
        xpath: "//div[@data-krn-type='krn-article']",
        value: { filter: "none" },
      },
    ],
    retryCount: 2,
    width: 955,
  },
  {
    name: "heute.at",
    clicks: ["//button[text()='Akzeptieren']"],
    removes: ["//div[@id='inside-full-top']"],
    retryCount: 2,
    width: 970,
  },
  {
    name: "bangkokpost.com",
    clicks: ["//a[text()='Accept and close']"],
    removes: [
      "//div[contains(@class,'ads-leaderboard')]",
      "//div[contains(@class,'sp-fancybox-wrap')]",
      "//div[contains(@class,'sp-fancybox-overlay')]",
    ],
    width: 992,
    desktopWidth: 992,
  },
  {
    name: "aljazeera.com",
    clicks: ["//button[text()='Allow All']"],
    removes: ["//div[contains(@class,'container--ads-leaderboard-mid')]"],
  },
  {
    name: "hln.be",
    removes: [
      "//li[contains(@class,'sixpack__advertisement-tile')]",
      "//div[contains(@class,'advertising-container-top')]",
    ],
    retryCount: 2,
    postDelay: 4000,
  },
  {
    name: "heraldsun.com.au",
    removes: ["//div[contains(@class,'header_ads-container')]"],
    width: 768,
    desktopWidth: 1008,
  },
  {
    name: "smh.com.au",
    clicks: ["//button[text()='Dismiss']"],
    // removes: ["//div[contains(@class,'header_ads-container')]"],
    styles: [
      {
        xpath: "//header[@data-testid='header']",
        value: { top: "0" },
      },
      {
        xpath: "//main/div/div[1]",
        value: { height: "144px" },
      },
    ],
    desktopWidth: 1024,
  },
  {
    name: "theglobeandmail.com",
    removes: ["//div[@id='fixedpencil-subs']", "//div[contains(@class,'adslot_collapse')]"],
    styles: [
      {
        xpath: "//div[@id='above-top-packages']/div[1]",
        value: { "margin-top": "0" },
      },
    ],
    width: 980,
    desktopWidth: 980,
  },
  {
    name: "thestar.com",
    clicks: ["//span[contains(@class,'alert-banner-container__breaking-close-btn')]"],
    removes: [
      "//div[contains(@class,'bcToasterContent')]",
      "//div[contains(@class,'leaderboard-ad-component')]",
      "//div[@data-lpos='gamp']",
    ],
    delay: 4000,
    desktopWidth: 1086,
  },
  {
    name: "nzherald.co.nz",
    clicks: [],
    removes: ["//div[@id='pd_div']", "//div[contains(@class,'action-bar')]", "//div[@id='premium-toaster']"],
    desktopWidth: 992,
  },
  {
    name: "timeslive.co.za",
    clicks: ["//button[contains(.,'Accept cookies')]"],
    removes: ["//div[child::div[@id='div-gpt-ad-banner-1']]"],
    desktopWidth: 992,
  },
  {
    name: "synonymer.se",
    clicks: ["//button[text()='H??ller med och forts??tt']"],
    removes: ["//div[child::div[contains(@class,'HBSynonymerPanorama')]]"],
  },
];

const iframeActions = [
  { name: "tcf2.telegraph.co.uk", clicks: ["//button[@title='Accept']"] },
  { name: "accounts.google.com", clicks: ["//div[@aria-label='Logga in med Google']//div[@id='close']"] },
  { name: "cmp.cdn.thesun.co.uk", clicks: ["//button[text()='Fine By Me!']"] },
  { name: "sourcepoint.theguardian.com", clicks: ["//button[text()=\"Yes, I???m happy\"]"] }, // prettier-ignore
  { name: "cdn.privacy-mgmt.com", clicks: ["//button[text()='YES, I AGREE']", "//button[text()='OK']", "//button[text()='Accept all']"], }, // prettier-ignore
  { name: "cmp.ad.nl", clicks: ["//button[text()='Akkoord']"] },
  { name: "cmp.vg.no", clicks: ["//button[text()='Jeg forst??r']"] },
  { name: "cmp.aftenposten.no", clicks: ["//button[text()='Jeg forst??r']"] },
  { name: "cmp.e24.no", clicks: ["//button[text()='Jeg forst??r']"] },
  { name: "cmp2.bild.de", clicks: ["//button[text()='Alle akzeptieren']"] },
  { name: "consent.t-online.de", clicks: ["//button[text()='AKZEPTIEREN UND WEITER']"] },
  { name: "sp-spiegel-de.spiegel.de", clicks: ["//button[contains(.,'Accept and continue')]"] },
  { name: "cmp.aftonbladet.se", clicks: ["//button[text()='Godk??nn alla cookies']"] },
  { name: "cmp.svd.se", clicks: ["//button[text()='Jag f??rst??r']"] },
  { name: "cmp.omni.se", clicks: ["//button[text()='Okej']"] },
  { name: "api.tinypass.com", clicks: ["//button[@aria-label='Close']", "//button[contains(@class,'pn-template__close')]"], }, // prettier-ignore
  { name: "cmpv2.independent.co.uk", clicks: ["//button[text()='AGREE']"] },
  { name: "cmp.dpgmedia.nl", clicks: ["//button[text()='Akkoord']"] },
  { name: "richmedia.cdnservices.net", clicks: "//h1[text()='TILL REALTID']" },
  { name: "consent-cdn.zeit.de", clicks: ["//button[text()='ACCEPT AND CONTINUE']"] },
  { name: "cmp.hln.be", clicks: ["//button[text()='Akkoord']"] },
  { name: "cmp.dpgmedia.be", clicks: ["//button[text()='Akkoord']"] },
  { name: "sourcepointcmp.bloomberg.com", clicks: ["//button[text()='Yes, I Accept']"] },
  { name: "cmp-consent-tool.privacymanager.io", clicks: ["//div[child::span[text()='Accept All']]"] },
  { name: "cmp.politico.eu", clicks: ["//button[text()='Agree']"] },
  { name: "cmp-sp.tagesspiegel.de", clicks: ["//button[text()='Alle akzeptieren']"] },
  { name: "consent.corren.se", clicks: ["//button[text()='Jag godk??nner']"] },
];

if (typeof module !== "undefined") {
  module.exports = { siteActions, iframeActions, defaultWidth, defaultDelay, defaultPostDelay };
}
