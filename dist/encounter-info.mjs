export const FERRY_INFO={name:'さんふらわあ',ports:'別府港・大分港・志布志港',fukuoka:'掲載航路では、福岡県内への寄港はありません。',source:'https://travel.willer.co.jp/ferry/carrier/71.html'};
export const FERRY_FACTS=[
  {title:'海の上にも、お風呂。',body:'展望大浴場がある船も。海を眺めながら、ゆったり過ごせるんだ。',source:FERRY_INFO.source},
  {title:'太陽のマークを探して。',body:'船体に描かれた大きな太陽が、さんふらわあの目印なんだ。',source:FERRY_INFO.source},
  {title:'環境にも、新しい工夫。',body:'大阪〜別府航路の「くれない・むらさき」は、日本初のLNG燃料フェリーなんだ。',source:'https://www.ferry-sunflower.co.jp/lp/newship/kurenai_murasaki/'}
];
export const ENCOUNTER_INFO={
  ferry:{name:FERRY_INFO.name,line:'ぱくっ。海を旅する、大きなフェリー！',note:'イラストから個別の船名は特定できないため、船社と掲載航路の情報を紹介しています。',rows:[['運航','商船三井さんふらわあ'],['九州の港',FERRY_INFO.ports],['福岡の寄港',FERRY_INFO.fukuoka]],source:FERRY_INFO.source,facts:FERRY_FACTS},
  museum:{name:'九州国立博物館',line:'ぱくっ。今度は、太宰府の「きゅーはく」！',note:'手描きのイラストを使った空想の演出です。',rows:[['所在地','福岡県太宰府市石坂4-7-2'],['どんな場所？','日本とアジアの文化交流を学ぶ国立博物館。'],['近くには','太宰府天満宮があるよ。']],source:'https://www.kyuhaku.jp/visit/visit_qanda.html',facts:[
    {title:'文化財を守る場所でもある。',body:'展示だけではなく、文化財を守り、調べる博物館科学の役割も担っているんだ。',source:'https://www.kyuhaku.jp/visit/visit_qanda.html'},
    {title:'「アジア」から日本を見る。',body:'日本文化がどのように形づくられたかを、アジアの歴史とつなげて紹介しているんだ。',source:'https://www.kyuhaku.jp/visit/visit_qanda.html'}
  ]},
  kamome:{name:'かもめ',line:'ぱくっ。さっき、窓のそばを飛んでいたね。',note:'このイラストだけで種は特定していません。ユリカモメの話は、仲間の一例です。',rows:[['なかま','海辺や河口などで見られるカモメのなかま。'],['福岡では','博多湾の水辺など。冬にはユリカモメもやってくる。']],source:'https://seibutsutayousei.city.fukuoka.lg.jp/learning/2232/',facts:[
    {title:'福岡市の鳥も、カモメのなかま。',body:'福岡市の鳥は「ユリカモメ」。秋から冬には、博多湾沿岸や室見川、大濠公園などで見られるんだ。',source:'https://seibutsutayousei.city.fukuoka.lg.jp/learning/2232/'},
    {title:'夏と冬で、顔が変わる仲間も。',body:'ユリカモメは、夏には頭が黒っぽくなるよ。冬とは違う姿をしているんだ。',source:'https://seibutsutayousei.city.fukuoka.lg.jp/learning/2187/'}
  ]}
};
