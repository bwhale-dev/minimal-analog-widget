import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { AnalogClock } from './AnalogClock';
import { Settings } from 'lucide-react';

import birdImage from '../../assets/70a7acff151a566bc418fa60595ea3d3c1da6fb5.png';
import cuckoohouseImage from '../../assets/11af2a2c29e4098142883e80e5af1d0f11d907ec.png';
import chimeAudioPath from '../../assets/Cuckoo_Clock01-01(Denoise-Short).mp3';

const weatherCodeMap: { [key: number]: { label: string; icon: string } } = {
  0: { label: "快晴", icon: "☀️" },
  1: { label: "晴れ", icon: "🌤️" },
  2: { label: "時々曇り", icon: "⛅" },
  3: { label: "曇り", icon: "☁️" },
  45: { label: "霧", icon: "🌫️" },
  61: { label: "小雨", icon: "🌦️" },
  80: { label: "にわか雨", icon: "☔" },
};

const MAXIMS = [
  { text: "あなたの時間は限られている。だから、誰か他の人の人生を生きることで時間を無駄にしてはいけない。", author: "スティーブ・ジョブズ" },
  { text: "行動の伴わない想像力には、何の意味もない。", author: "チャーリー・チャップリン" },
  { text: "失敗したことのない人間というのは、挑戦したことのない人間だ。", author: "アインシュタイン" },
  { text: "幸福とは、あなたが考えること、言うこと、することが調和している状態だ。", author: "ガンジー" },
  { text: "愛は、ただ与えることで成長する。", author: "ヘンリー・ミラー" },
  { text: "暗闇を呪うより、一本のロウソクに火を灯しなさい。", author: "エレノア・ルーズベルト" },
  { text: "明日死ぬかのように生きよ。永遠に生きるかのように学べ。", author: "ガンジー" },
  { text: "情熱なしに成し遂げられた偉業など、かつてひとつも存在しない。", author: "エマーソン" },
  { text: "一度も失敗をしたことがない人は、何も新しいことに挑戦したことがない人だ。", author: "アインシュタイン" },
  { text: "自分の道を進む者は、誰の足跡も追わない。", author: "ジョーン・バエズ" },
  { text: "最善を尽くせ。そうすれば、あとは自然にうまくいく。", author: "エジソン" },
  { text: "木を植えるのに最も良い時期は20年前だった。次に良い時期は今だ。", author: "中国の格言" },
  { text: "凧が一番高く上がるのは、風に乗っている時ではなく、風に逆らっている時だ。", author: "チャーチル" },
  { text: "地獄を歩んでいるのなら、そのまま歩き続けろ。", author: "チャーチル" },
  { text: "夢を見ることができるなら、それは実現できる。", author: "ウォルト・ディズニー" },
  { text: "変化は苦痛だが、必要不可欠だ。", author: "ニーチェ" },
  { text: "あなたの心に従う勇気を持ってください。", author: "スティーブ・ジョブズ" },
  { text: "生きることは、行動することだ。", author: "ルソー" },
  { text: "最大の名誉は、一度も転ばないことではなく、転ぶたびに起き上がることにある。", author: "コンフキウス" },
  { text: "不可能とは、自らの力で世界を切り拓くことを放棄した臆病者の言葉だ。", author: "モハメド・アリ" }
];

export function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [isChiming, setIsChiming] = useState(false);
  const [birdFlying, setBirdFlying] = useState(false);
  const [birdPosition, setBirdPosition] = useState('150px');
  const [chimeCount, setChimeCount] = useState(0);
  const [bgColor, setBgColor] = useState('#fefdfb');
  const [borderColor, setBorderColor] = useState('#000000');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(80);
  const [autoChime, setAutoChime] = useState(true);
  const [chimeInterval, setChimeInterval] = useState(60);
  const [weather, setWeather] = useState({ label: "取得中...", icon: "⌛" });
  const [dailyMaxim, setDailyMaxim] = useState({ text: "名言を読み込み中...", author: "" });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // ウィンドウサイズ変更を監視
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchMaxim = useCallback(() => {
    const randomItem = MAXIMS[Math.floor(Math.random() * MAXIMS.length)];
    setDailyMaxim(randomItem);
  }, []);

  useEffect(() => {
    const savedSettings = localStorage.getItem('chickenClockSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setBgColor(settings.bgColor ?? '#fefdfb');
        setBorderColor(settings.borderColor ?? '#000000');
        setSoundEnabled(settings.soundEnabled ?? true);
        setVolume(settings.volume?.[0] ?? 80);
        setAutoChime(settings.autoChime ?? true);
        setChimeInterval(settings.chimeInterval?.[0] ?? 60);
      } catch (e) { console.error(e); }
    }
    fetchMaxim();
  }, [location, fetchMaxim]);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code`);
        const data = await res.json();
        setWeather(weatherCodeMap[data.current.weather_code] || { label: "不明", icon: "❓" });
      } catch (e) { setWeather({ label: "エラー", icon: "⚠️" }); }
    };

    const savedSettings = localStorage.getItem('chickenClockSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.lat && settings.lon) {
        fetchWeather(settings.lat, settings.lon);
        return;
      }
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeather(35.6895, 139.6917)
    );
  }, [location]);

  useEffect(() => {
    const timer = setInterval(() => { setTime(new Date()); }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (birdFlying) {
      setBirdPosition('150px');
      const timer = setTimeout(() => { setBirdPosition('-100px'); }, 10);
      return () => clearTimeout(timer);
    } else {
      setBirdPosition('150px');
    }
  }, [birdFlying]);

  const playChimeSound = (v: number) => {
    if (!soundEnabled) return;
    const audio = new Audio(chimeAudioPath);
    audio.volume = v / 100;
    audio.play().catch(() => {});
  };

  const handleChime = () => {
    const currentHour = time.getHours();
    const chimeTimes = currentHour % 12 === 0 ? 12 : currentHour % 12;
    setIsChiming(true);
    setChimeCount(0);
    let count = 0;
    const interval = setInterval(() => {
      if (count < chimeTimes) {
        setBirdFlying(true);
        playChimeSound(volume);
        setChimeCount(count + 1);
        count++;
        setTimeout(() => { setBirdFlying(false); }, 500);
      } else { clearInterval(interval); }
    }, 600);
    setTimeout(() => {
      setIsChiming(false);
      setBirdFlying(false);
      setChimeCount(0);
    }, chimeTimes * 600 + 1500);
  };

  const formatTime = (date: Date) => {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return `${y}.${m}.${d} ${days[date.getDay()]}`;
  };

  const maximFontSize = dailyMaxim.text.length <= 30 
    ? 'text-2xl md:text-3xl' 
    : 'text-lg md:text-2xl';
  const authorFontSize = dailyMaxim.text.length <= 30 
    ? 'text-xl md:text-2xl' 
    : 'text-base md:text-xl';

  // SVG時計のサイズ（モバイル80px, タブレット以上120px）
  const clockSize = isMobile ? 70 : 100;
  // 鳩時計の画像サイズ（モバイル200px, タブレット以上300px）
  const houseMaxWidth = isMobile ? 200 : 300;

  return (
   <div className="flex items-center justify-center p-4 md:p-8 md:min-h-screen w-full">
      <div
        className="relative w-full max-w-4xl p-4 md:p-12"
        style={{
          backgroundColor: bgColor,
          border: `4px solid ${borderColor}`,
          filter: 'url(#roughEdges)',
          boxShadow: '10px 10px 0px 0px rgba(0,0,0,1)',
          color: bgColor === '#2d3436' ? '#ffffff' : '#000000',
        }}
      >
        <div className="absolute top-2 left-4 z-50">
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm md:text-base font-bold"
            style={{ 
              backgroundColor: bgColor === '#2d3436' ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
              color: bgColor === '#2d3436' ? '#ffffff' : '#000000',
              border: `2px solid ${borderColor}`,
              filter: 'url(#roughEdges)' 
            }}
          >
            <Settings size={20} /> 
            <span>設定</span>
          </button>
        </div>

                  {/* モバイル: 縦並び, md以上: 横並び */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-3 md:gap-10 w-full">
            {/* 左側: 時間・日付・名言・天気・ボタン */}
            <div className="flex-1 w-full mt-28 md:mt-0">
            <div className="text-4xl md:text-7xl font-bold tracking-tight mb-2 leading-none">
              {formatTime(time)}
            </div>
            <div className="text-base md:text-xl mb-6 md:mb-8 opacity-70">
              {formatDate(time)}
            </div>

            <div className="mb-6 md:mb-10 w-full">
              <div className={`font-serif italic leading-relaxed whitespace-pre-wrap ${maximFontSize}`}>
                {dailyMaxim.text}
              </div>
              <div className={`mt-3 font-serif opacity-80 text-right ${authorFontSize}`}>
                ― {dailyMaxim.author}
              </div>
            </div>

            <div className="flex items-center gap-3 text-2xl md:text-3xl mb-6 md:mb-8">
              <span className="text-3xl md:text-4xl">{weather.icon}</span>
              <span className="text-base md:text-lg">{weather.label}</span>
            </div>

            <button
              onClick={handleChime}
              className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-lg font-bold w-full md:w-auto"
              style={{
                backgroundColor: bgColor === '#2d3436' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)',
                color: bgColor === '#2d3436' ? '#ffffff' : '#000000',
                border: `2px solid ${borderColor}`,
                filter: 'url(#roughEdges)',
              }}
            >
              鳩時計を開始する
            </button>
          </div>

          {/* 右側: 鳩時計の画像 */}
          {/* 右側: 鳩時計の画像 */}
          <div className="w-full md:w-auto md:flex-shrink-0 relative flex justify-center md:justify-end" style={{ minHeight: '250px' }}>
            {birdFlying && (
              <img
                src={birdImage}
                alt="Bird"
                className="absolute w-12 md:w-16 h-12 md:h-16 z-10 transition-all duration-800"
                style={{ top: birdPosition, left: '50%', transform: 'translateX(-50%)', maxWidth: '100%' }}
              />
            )}
            <div className="relative w-full max-w-xs">
              <img 
                src={cuckoohouseImage} 
                alt="House" 
                className="w-full mx-auto block"
                style={{ maxWidth: `${houseMaxWidth}px` }}
              />
              <div 
                className="absolute"
                style={{
                  top: isMobile ? '42%' : '56%',  // スマホを48%に調整
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  filter: bgColor === '#2d3436' ? 'invert(1) brightness(2)' : 'none',
                }}
              >
                <AnalogClock time={time} size={clockSize} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
