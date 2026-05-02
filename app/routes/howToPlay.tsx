import { useState } from "react";
import { useNavigate } from "react-router";

export function meta() {
  return [
    { title: "あそびかた - アイスクリームゲーム" },
    { name: "description", content: "ゲームの遊び方ページ（準備中）" },
  ];
}
// prettier-ignore
export default function HowToPlay() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: "ゲームの概要",
      content: (
        <section className="w-full max-w-3xl rounded-xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h2 className="mb-3 text-xl font-bold text-gray-800">ゲームの<ruby>概要<rt>がいよう</rt></ruby></h2>
          <p className="mb-3 text-gray-700">
            このゲームは、さまざまな<ruby>役割<rt>やくわり</rt></ruby>を<ruby>持<rt>も</rt></ruby>つ<ruby>人々<rt>ひとびと</rt></ruby>を<ruby>組<rt>く</rt></ruby>み<ruby>合<rt>あ</rt></ruby>わせて、お<ruby>題<rt>だい</rt></ruby>に<ruby>沿<rt>そ</rt></ruby>ったアイスクリームを<ruby>作<rt>つく</rt></ruby>るゲームです。
          </p>
          <p className="mb-3 text-gray-700">
            アイス<ruby>作<rt>づく</rt></ruby>りを<ruby>手伝<rt>てつだ</rt></ruby>ってくれる<ruby>人<rt>ひと</rt></ruby>たちは<ruby>個性<rt>こせい</rt></ruby><ruby>豊<rt>ゆた</rt></ruby>かで、バニラアイスをのせる<ruby>人<rt>ひと</rt></ruby>、<ruby>赤<rt>あか</rt></ruby>いコーンのアイスだけベルトコンベアを<ruby>切<rt>き</rt></ruby>り<ruby>替<rt>か</rt></ruby>える<ruby>人<rt>ひと</rt></ruby>、さらには<ruby>流<rt>なが</rt></ruby>れてきたアイスの<ruby>中<rt>なか</rt></ruby>から<ruby>好<rt>す</rt></ruby>きな<ruby>味<rt>あじ</rt></ruby>だけを<ruby>食<rt>た</rt></ruby>べてしまう<ruby>人<rt>ひと</rt></ruby>まで<ruby>登場<rt>とうじょう</rt></ruby>します。
          </p>
          <p className="mb-3 text-gray-700">
            どの<ruby>人<rt>ひと</rt></ruby>をどう<ruby>組<rt>く</rt></ruby>み<ruby>合<rt>あ</rt></ruby>わせるかによって、<ruby>完成<rt>かんせい</rt></ruby>するアイスは<ruby>大<rt>おお</rt></ruby>きく<ruby>変<rt>か</rt></ruby>わります。
          </p>
          <p className="text-gray-700">
            ステージごとに<ruby>登場<rt>とうじょう</rt></ruby>する<ruby>人々<rt>ひとびと</rt></ruby>を<ruby>上手<rt>うま</rt></ruby>く<ruby>配置<rt>はいち</rt></ruby>して、お<ruby>題<rt>だい</rt></ruby>のアイスを<ruby>作<rt>つく</rt></ruby>り<ruby>上<rt>あ</rt></ruby>げることができるでしょうか。
          </p>
        </section>
      ),
    },
    {
      title: "ステージ<ruby>選<rt>せん</rt></ruby><ruby>択<rt>たく</rt></ruby>",
      content: (
        <section className="mt-6 w-full max-w-3xl rounded-xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h2 className="mb-3 text-xl font-bold text-gray-800">ステージ<ruby>選<rt>せん</rt></ruby><ruby>択<rt>たく</rt></ruby></h2>
          <p className="mb-3 text-gray-700">
            このゲームには、<ruby>全<rt>ぜん</rt></ruby><ruby>部<rt>ぶ</rt></ruby>で number <ruby>個<rt>こ</rt></ruby>のステージがあります。
          </p>
          <p className="mb-3 text-gray-700">
            ホーム<ruby>画<rt>が</rt></ruby><ruby>面<rt>めん</rt></ruby>の「ステージ<ruby>選<rt>せん</rt></ruby><ruby>択<rt>たく</rt></ruby>」ボタンを<ruby>押<rt>お</rt></ruby>すと、1〜number のステージ<ruby>番<rt>ばん</rt></ruby><ruby>号<rt>ごう</rt></ruby>が<ruby>並<rt>なら</rt></ruby>んだ<ruby>画<rt>が</rt></ruby><ruby>面<rt>めん</rt></ruby>に<ruby>移<rt>い</rt></ruby><ruby>動<rt>どう</rt></ruby>します。
          </p>
          <p className="text-gray-700">
            <ruby>遊<rt>あそ</rt></ruby>びたいステージの<ruby>番<rt>ばん</rt></ruby><ruby>号<rt>ごう</rt></ruby>をタップすると、<ruby>選<rt>えら</rt></ruby>んだステージのプレイが<ruby>開<rt>かい</rt></ruby><ruby>始<rt>し</rt></ruby>されます。
          </p>
          <div className="text-center mt-4">
            <img src="/stage_select.png" alt="ステージ選択画面" className="inline-block w-128 h-64" />
          </div>
        </section>
      ),
    },
    {
      title: "ステージ<ruby>画<rt>が</rt></ruby><ruby>面<rt>めん</rt></ruby>",
      content: (
        <section className="mt-6 w-full max-w-3xl rounded-xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h2 className="mb-3 text-xl font-bold text-gray-800">ステージ<ruby>画<rt>が</rt></ruby><ruby>面<rt>めん</rt></ruby>Ⅰ</h2>
          <p className="mb-3 text-gray-700">
            ステージを<ruby>選<rt>せん</rt></ruby><ruby>択<rt>たく</rt></ruby>すると、ステージ<ruby>画<rt>が</rt></ruby><ruby>面<rt>めん</rt></ruby>に<ruby>移<rt>い</rt></ruby><ruby>動<rt>どう</rt></ruby>します。
            この<ruby>画<rt>が</rt></ruby><ruby>面<rt>めん</rt></ruby>には、プレイに<ruby>必<rt>ひつ</rt></ruby><ruby>要<rt>よう</rt></ruby>なさまざまな<ruby>情<rt>じょう</rt></ruby><ruby>報<rt>ほう</rt></ruby>が<ruby>表<rt>ひょう</rt></ruby><ruby>示<rt>じ</rt></ruby>されています。
          </p>
          <p className="mb-3 text-gray-700">
            <ruby>左<rt>ひだり</rt></ruby><ruby>上<rt>うえ</rt></ruby>には、そのステージのミッション（<ruby>作<rt>つく</rt></ruby>りたいアイスクリーム）が<ruby>書<rt>か</rt></ruby>かれています。
            このミッションを<ruby>達<rt>たっ</rt></ruby><ruby>成<rt>せい</rt></ruby>できるよう、<ruby>人々<rt>ひとびと</rt></ruby>を<ruby>上手<rt>じょうず</rt></ruby>に<ruby>配<rt>はい</rt></ruby><ruby>置<rt>ち</rt></ruby>しましょう。
          </p>
          <div className="text-center mt-4">
            <img src="/stage_screen.png" alt="ステージ画面の説明" className="inline-block w-128 h-64 mx-2" />
          </div>
        </section>
      ),
    },
    {
      title: "ステージ<ruby>画<rt>が</rt></ruby><ruby>面<rt>めん</rt></ruby>",
      content: (
        <section className="mt-6 w-full max-w-3xl rounded-xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h2 className="mb-3 text-xl font-bold text-gray-800">ステージ<ruby>画<rt>が</rt></ruby><ruby>面<rt>めん</rt></ruby>Ⅱ</h2>
          <p className="mb-3 text-gray-700">
            <ruby>画<rt>が</rt></ruby><ruby>面<rt>めん</rt></ruby><ruby>下<rt>した</rt></ruby>には、このステージで<ruby>作<rt>さ</rt></ruby><ruby>業<rt>ぎょう</rt></ruby>してくれる<ruby>人<rt>ひと</rt></ruby>たちが<ruby>並<rt>なら</rt></ruby>んでいます。
            <ruby>作<rt>さ</rt></ruby><ruby>業<rt>ぎょう</rt></ruby>に<ruby>参<rt>さん</rt></ruby><ruby>加<rt>か</rt></ruby>させたい<ruby>人<rt>ひと</rt></ruby>がいたら、ドラッグ＆ドロップで<ruby>好<rt>す</rt></ruby>きな<ruby>場<rt>ば</rt></ruby><ruby>所<rt>しょ</rt></ruby>に<ruby>配<rt>はい</rt></ruby><ruby>置<rt>ち</rt></ruby>できます。
          </p>
          <div className="text-center mt-4">
            <img src="/stage_screen.png" alt="ステージ画面の説明" className="inline-block w-128 h-64 mx-2" />
          </div>
        </section>
      ),
    },
    {
      title: "ステージ<ruby>画<rt>が</rt></ruby><ruby>面<rt>めん</rt></ruby>",
      content: (
        <section className="mt-6 w-full max-w-3xl rounded-xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h2 className="mb-3 text-xl font-bold text-gray-800">ステージ<ruby>画<rt>が</rt></ruby><ruby>面<rt>めん</rt></ruby>Ⅲ</h2>
          <p className="mb-3 text-gray-700">
            <ruby>右<rt>みぎ</rt></ruby><ruby>下<rt>した</rt></ruby>には「<ruby>実<rt>じっ</rt></ruby><ruby>行<rt>こう</rt></ruby>」ボタンがあります。
            <ruby>配<rt>はい</rt></ruby><ruby>置<rt>ち</rt></ruby>が<ruby>整<rt>ととの</rt></ruby>ったと<ruby>思<rt>おも</rt></ruby>ったら、このボタンを<ruby>押<rt>お</rt></ruby>してみましょう。<ruby>押<rt>お</rt></ruby>すと、さまざまな<ruby>色<rt>いろ</rt></ruby>のコーンが<ruby>流<rt>なが</rt></ruby>れてきます。
          </p>
          <p className="mb-3 text-gray-700">
            お<ruby>題<rt>だい</rt></ruby>どおりのアイスを<ruby>作<rt>つく</rt></ruby>ることができれば<ruby>成<rt>せい</rt></ruby><ruby>功<rt>こう</rt></ruby>です。
            もし<ruby>失<rt>しっ</rt></ruby><ruby>敗<rt>ぱい</rt></ruby>してしまっても、<ruby>何<rt>なん</rt></ruby><ruby>度<rt>ど</rt></ruby>でもやり<ruby>直<rt>なお</rt></ruby>せます。
          </p>
          <div className="text-center mt-4">
            <img src="/stage_screen.png" alt="ステージ画面の説明" className="inline-block w-128 h-64 mx-2" />
          </div>
        </section>
      ),
    },
    {
      title: "ステージ<ruby>画<rt>が</rt></ruby><ruby>面<rt>めん</rt></ruby>",
      content: (
        <section className="mt-6 w-full max-w-3xl rounded-xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h2 className="mb-3 text-xl font-bold text-gray-800">ステージ<ruby>画<rt>が</rt></ruby><ruby>面<rt>めん</rt></ruby>Ⅳ</h2>
          <p className="text-gray-700">
            <ruby>別<rt>べつ</rt></ruby>のステージで<ruby>遊<rt>あそ</rt></ruby>びたくなった<ruby>場<rt>ば</rt></ruby><ruby>合<rt>あい</rt></ruby>は、<ruby>左<rt>ひだり</rt></ruby><ruby>上<rt>うえ</rt></ruby>の「<ruby>戻<rt>もど</rt></ruby>る」ボタンを<ruby>押<rt>お</rt></ruby>してください。
            ステージ<ruby>選<rt>せん</rt></ruby><ruby>択<rt>たく</rt></ruby><ruby>画<rt>が</rt></ruby><ruby>面<rt>めん</rt></ruby>に<ruby>戻<rt>もど</rt></ruby>ることができます。
          </p>
          <div className="text-center mt-4">
            <img src="/stage_screen.png" alt="ステージ画面の説明" className="inline-block w-128 h-64 mx-2" />
          </div>
        </section>
      ),
    },
    {
      title: "アイス<ruby>作<rt>づく</rt></ruby>りを<ruby>手伝<rt>てつだ</rt></ruby>ってくれる<ruby>人<rt>ひと</rt></ruby>",
      content: (
        <section className="mt-6 w-full max-w-3xl rounded-xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h2 className="mb-3 text-xl font-bold text-gray-800">アイス<ruby>作<rt>づく</rt></ruby>りを<ruby>手伝<rt>てつだ</rt></ruby>ってくれる<ruby>人<rt>ひと</rt></ruby>Ⅰ</h2>
          
          <p className="mb-4 text-gray-700">
            アイス<ruby>作<rt>づく</rt></ruby>りを<ruby>手伝<rt>てつだ</rt></ruby>ってくれるのは<ruby>次<rt>つぎ</rt></ruby>の3<ruby>種<rt>しゅ</rt></ruby><ruby>類<rt>るい</rt></ruby>の<ruby>人<rt>ひと</rt></ruby>たちがいます。
          </p>

          <ul className="mb-4 space-y-1 text-gray-700">
            <li>・ アイスを<ruby>置<rt>お</rt></ruby>いてくれる<ruby>人<rt>ひと</rt></ruby></li>
            <li>・ コーンを<ruby>条<rt>じょう</rt></ruby><ruby>件<rt>けん</rt></ruby>に<ruby>応<rt>おう</rt></ruby>じて<ruby>分<rt>ぶん</rt></ruby><ruby>岐<rt>き</rt></ruby>させる<ruby>人<rt>ひと</rt></ruby></li>
            <li>・ アイスを<ruby>食<rt>た</rt></ruby>べてしまう<ruby>人<rt>ひと</rt></ruby></li>
          </ul>
          <div className="text-center mt-4">
            <img src="/push_vanilla.png" alt="バニラアイスをのせる人" className="inline-block h-16 mx-2" />
            <img src="/if_true.png" alt="コーンを分けて流す人" className="inline-block h-16 mx-2" />
            <img src="/pop_chocolate.png" alt="アイスを食べてしまう人" className="inline-block h-16 mx-2" />
          </div>
        </section>
      ),
    },
    {
      title: "アイス<ruby>作<rt>づく</rt></ruby>りを<ruby>手伝<rt>てつだ</rt></ruby>ってくれる<ruby>人<rt>ひと</rt></ruby>",
      content: (
        <section className="mt-6 w-full max-w-3xl rounded-xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h2 className="mb-3 text-xl font-bold text-gray-800">アイス<ruby>作<rt>づく</rt></ruby>りを<ruby>手伝<rt>てつだ</rt></ruby>ってくれる<ruby>人<rt>ひと</rt></ruby>Ⅱ</h2>

          <div className="mb-4 space-y-3 text-gray-700">
            <div>
              <p className="font-bold mb-2">アイスを<ruby>置<rt>お</rt></ruby>いてくれる<ruby>人<rt>ひと</rt></ruby></p>
              <p className="mb-2">
                この<ruby>人<rt>ひと</rt></ruby>たちは、コーンの<ruby>上<rt>うえ</rt></ruby>に<ruby>特<rt>とく</rt></ruby><ruby>定<rt>てい</rt></ruby>の<ruby>味<rt>あじ</rt></ruby>のアイスを<ruby>置<rt>お</rt></ruby>いてくれます。
                <ruby>置<rt>お</rt></ruby>くアイスの<ruby>味<rt>あじ</rt></ruby>は、<ruby>服<rt>ふく</rt></ruby>の<ruby>色<rt>いろ</rt></ruby>で<ruby>判<rt>はん</rt></ruby><ruby>別<rt>べつ</rt></ruby>できます。
              </p>
              <ul className="mb-2 space-y-1 ml-4">
                <li>・ <ruby>白<rt>しろ</rt></ruby><ruby>色<rt>いろ</rt></ruby>：バニラ</li>
                <li>・ <ruby>茶<rt>ちゃ</rt></ruby><ruby>色<rt>いろ</rt></ruby>：チョコ</li>
                <li>・ <ruby>桃<rt>もも</rt></ruby><ruby>色<rt>いろ</rt></ruby>：イチゴ</li>
              </ul>
              <p>
                ただし、コーンの<ruby>上<rt>うえ</rt></ruby>にアイスが５<ruby>個<rt>こ</rt></ruby><ruby>以<rt>い</rt></ruby><ruby>上<rt>じょう</rt></ruby><ruby>載<rt>の</rt></ruby>っている<ruby>場<rt>ば</rt></ruby><ruby>合<rt>あい</rt></ruby>は、<ruby>新<rt>あらた</rt></ruby>しくアイスを<ruby>置<rt>お</rt></ruby>くことができません。
              </p>
            </div>
          </div>
          <div className="text-center mt-4">
            <img src="/push_vanilla.png" alt="バニラアイスをのせる人" className="inline-block h-16 mx-2" />
            <img src="/push_chocolate.png" alt="チョコアイスをのせる人" className="inline-block h-16 mx-2" />
            <img src="/push_strawberry.png" alt="イチゴアイスをのせる人" className="inline-block h-16 mx-2" />
          </div>
        </section>
      ),
    },
    {
      title: "アイス<ruby>作<rt>づく</rt></ruby>りを<ruby>手伝<rt>てつだ</rt></ruby>ってくれる<ruby>人<rt>ひと</rt></ruby>",
      content: (
        <section className="mt-6 w-full max-w-3xl rounded-xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h2 className="mb-3 text-xl font-bold text-gray-800">アイス<ruby>作<rt>づく</rt></ruby>りを<ruby>手伝<rt>てつだ</rt></ruby>ってくれる<ruby>人<rt>ひと</rt></ruby>Ⅲ</h2>

          <div className="mb-4 space-y-3 text-gray-700">

            <div>
              <p className="font-bold mb-2">コーンを<ruby>分<rt>わ</rt></ruby>けて<ruby>流<rt>なが</rt></ruby>す<ruby>人<rt>ひと</rt></ruby></p>
              <p className="mb-2">
                この<ruby>人<rt>ひと</rt></ruby>たちは、<ruby>流<rt>なが</rt></ruby>れてきたコーンの<ruby>状<rt>じょう</rt></ruby><ruby>態<rt>たい</rt></ruby>に<ruby>応<rt>おう</rt></ruby>じて、コーンを2つの<ruby>経<rt>けい</rt></ruby><ruby>路<rt>ろ</rt></ruby>に<ruby>振<rt>ふ</rt></ruby>り<ruby>分<rt>わ</rt></ruby>けます。
                <ruby>条<rt>じょう</rt></ruby><ruby>件<rt>けん</rt></ruby>によって<ruby>見<rt>み</rt></ruby>た<ruby>目<rt>め</rt></ruby>が<ruby>異<rt>こと</rt></ruby>なり、<ruby>次<rt>つぎ</rt></ruby>の4<ruby>種<rt>しゅ</rt></ruby><ruby>類<rt>るい</rt></ruby>の<ruby>条<rt>じょう</rt></ruby><ruby>件<rt>けん</rt></ruby>があります。
              </p>
              <ul className="mb-2 space-y-1 ml-4">
                <li>・ Ⅰ：コーンの<ruby>色<rt>いろ</rt></ruby></li>
                <li>・ Ⅱ：<ruby>載<rt>の</rt></ruby>っているアイスの<ruby>数<rt>かず</rt></ruby></li>
                <li>・ Ⅲ：<ruby>一<rt>いち</rt></ruby><ruby>番<rt>ばん</rt></ruby><ruby>上<rt>うえ</rt></ruby>に<ruby>載<rt>の</rt></ruby>っているアイスの<ruby>種<rt>しゅ</rt></ruby><ruby>類<rt>るい</rt></ruby></li>
                <li>・ Ⅳ：<ruby>特<rt>とく</rt></ruby><ruby>定<rt>てい</rt></ruby>のアイスの<ruby>並<rt>なら</rt></ruby>び<ruby>順<rt>じゅん</rt></ruby>の<ruby>有<rt>う</rt></ruby><ruby>無<rt>む</rt></ruby></li>
              </ul>
              <p>
                それぞれの<ruby>条<rt>じょう</rt></ruby><ruby>件<rt>けん</rt></ruby>に<ruby>従<rt>したが</rt></ruby>って、コーンを<ruby>上<rt>じょう</rt></ruby><ruby>下<rt>げ</rt></ruby>どちらかの<ruby>経<rt>けい</rt></ruby><ruby>路<rt>ろ</rt></ruby>へ<ruby>流<rt>なが</rt></ruby>します。
              </p>
            </div>
          </div>
          <div className="text-center mt-4">
            <img src="/if_true.png" alt="コーンを分けて流す人(TRUE)" className="inline-block h-16 mx-2" />
            <img src="/if_false.png" alt="コーンを分けて流す人(FALSE)" className="inline-block h-16 mx-2" />
          </div>
        </section>
      ),
    },
    {
      title: "アイス<ruby>作<rt>づく</rt></ruby>りを<ruby>手伝<rt>てつだ</rt></ruby>ってくれる<ruby>人<rt>ひと</rt></ruby>",
      content: (
        <section className="mt-6 w-full max-w-3xl rounded-xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h2 className="mb-3 text-xl font-bold text-gray-800">アイス<ruby>作<rt>づく</rt></ruby>りを<ruby>手伝<rt>てつだ</rt></ruby>ってくれる<ruby>人<rt>ひと</rt></ruby>Ⅳ</h2>
          <div className="mb-4 space-y-3 text-gray-700">
            <div>
              <p className="font-bold mb-2">③ アイスを<ruby>食<rt>た</rt></ruby>べてしまう<ruby>人<rt>ひと</rt></ruby></p>
              <p className="mb-2">
                この<ruby>人<rt>ひと</rt></ruby>たちは、<ruby>特<rt>とく</rt></ruby><ruby>定<rt>てい</rt></ruby>の<ruby>味<rt>あじ</rt></ruby>のアイスが<ruby>大<rt>だい</rt></ruby><ruby>好<rt>す</rt></ruby>きです。
                その<ruby>味<rt>あじ</rt></ruby>のアイスが<ruby>一<rt>いち</rt></ruby><ruby>番<rt>ばん</rt></ruby><ruby>上<rt>うえ</rt></ruby>に<ruby>載<rt>の</rt></ruby>ったコーンが<ruby>流<rt>なが</rt></ruby>れてくると、<ruby>一<rt>いち</rt></ruby><ruby>番<rt>ばん</rt></ruby><ruby>上<rt>うえ</rt></ruby>のアイスを<ruby>食<rt>た</rt></ruby>べてしまいます。
              </p>
              <p className="mb-2 font-semibold">ただし、</p>
              <ul className="mb-2 space-y-1 ml-4">
                <li>・ アイスが1つも<ruby>載<rt>の</rt></ruby>っていない</li>
                <li>・ <ruby>一<rt>いち</rt></ruby><ruby>番<rt>ばん</rt></ruby><ruby>上<rt>うえ</rt></ruby>のアイスが<ruby>好<rt>す</rt></ruby>きな<ruby>味<rt>あじ</rt></ruby>ではない</li>
              </ul>
              <p>
                といった<ruby>場<rt>ば</rt></ruby><ruby>合<rt>あい</rt></ruby>は、<ruby>何<rt>なに</rt></ruby>もしません。
              </p>
              <p className="mb-2 font-semibold">
                ※<ruby>黒<rt>くろ</rt></ruby>い<ruby>服<rt>ふく</rt></ruby>の人は、どんな<ruby>味<rt>あじ</rt></ruby>も<ruby>大<rt>だい</rt></ruby><ruby>好<rt>す</rt></ruby>きです！
              </p>
            </div>
          </div>
          <div className="text-center mt-4">
            <img src="/pop_vanilla.png" alt="バニラアイスを食べる人" className="inline-block h-16 mx-2" />
            <img src="/pop_chocolate.png" alt="チョコアイスを食べる人" className="inline-block h-16 mx-2" />
            <img src="/pop_strawberry.png" alt="イチゴアイスを食べる人" className="inline-block h-16 mx-2" />
            <img src="/pop.png" alt="何でも食べる人" className="inline-block h-16 mx-2" />
          </div>
        </section>
      ),
    },
    
    {
      title: "終わりに",
      content: (
        <section className="mt-6 w-full max-w-3xl rounded-xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h2 className="mb-3 text-xl font-bold text-gray-800">終わりに</h2>
          <div className="text-gray-700">
            <p className="mb-2">
              これで<ruby>遊<rt>あそ</rt></ruby>び<ruby>方<rt>かた</rt></ruby>の<ruby>説<rt>せつ</rt></ruby><ruby>明<rt>めい</rt></ruby>は<ruby>終<rt>お</rt></ruby>わりです。           </p>
            <p>
              ここまできちんと<ruby>読<rt>よ</rt></ruby>みこんだあなたなら、きっとアイスクリームを<ruby>完<rt>かん</rt></ruby><ruby>成<rt>せい</rt></ruby>できるはずです。
            </p>
            <p>
              <ruby>実<rt>じっ</rt></ruby><ruby>際<rt>さい</rt></ruby>にプレイしてみましょう！
            </p>
          </div>
          <div className="text-center mt-4">
            <img src="/cone_yellow.png" alt="コーン(黄)" className="inline-block h-16 mx-2" />
            <img src="/ice_vanilla.png" alt="バニラアイス" className="inline-block h-16 mx-2" />
            <img src="/cone_brown.png" alt="コーン(茶)" className="inline-block h-16 mx-2" />
            <img src="/ice_chocolate.png" alt="チョコアイス" className="inline-block h-16 mx-2" />
            <img src="/cone_red.png" alt="コーン(赤)" className="inline-block h-16 mx-2" />
            <img src="/ice_strawberry.png" alt="イチゴアイス" className="inline-block h-16 mx-2" />
          </div>
          
        </section>
      ),
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-linear-to-b from-cyan-50 via-violet-50 to-pink-50 p-4">
      <header className="relative flex items-center justify-center border-b border-gray-200 pb-4">
        <button
          className="absolute left-0 top-0 m-4 rounded border border-gray-400 bg-white px-3 py-1 text-sm font-bold hover:bg-gray-100"
          onClick={() => navigate("/")}
          aria-label="ホームに戻る"
        >
            
            ホームに<ruby>戻<rt>もど</rt></ruby>る
            
            
        </button>

        <h1 className="text-lg font-bold text-gray-800" dangerouslySetInnerHTML={{ __html: pages[currentPage].title }} />
      </header>

      <main className="mt-8 flex flex-1 flex-col items-center justify-start text-left">
        <div className="mt-6 flex w-full max-w-3xl justify-between">
          {currentPage > 0 ? (
            <button
              className="rounded border border-gray-400 bg-white px-4 py-2 text-sm font-bold text-gray-800 hover:bg-gray-100"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              aria-label="前のページへ"
            >
              <ruby>戻<rt>もど</rt></ruby>る
            </button>
          ) : (
            <div />
          )}

          {currentPage < pages.length - 1 ? (
            <button
              className="rounded border border-gray-400 bg-white px-4 py-2 text-sm font-bold text-gray-800 hover:bg-gray-100"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              aria-label="次のページへ"
            >
              <ruby>次<rt>つぎ</rt></ruby>へ
            </button>
          ) : (
            <div />
          )}
        </div>

        {pages[currentPage].content}
      </main>
    </div>
  );
}
