import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Link } from 'react-router-dom';

export const Settings = () => {
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoChime, setAutoChime] = useState(true);
  const [chimeInterval, setChimeInterval] = useState([60]);
  const [volume, setVolume] = useState([80]);
  const [bgColor, setBgColor] = useState('#fefdfb');
  const [borderColor, setBorderColor] = useState('#000000');
  const [saveMessage, setSaveMessage] = useState('');

  const [cityName, setCityName] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [locationLabel, setLocationLabel] = useState('');

  useEffect(() => {
    const savedSettings = localStorage.getItem('chickenClockSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setSoundEnabled(settings.soundEnabled ?? true);
        setAutoChime(settings.autoChime ?? true);
        setChimeInterval(Array.isArray(settings.chimeInterval) ? settings.chimeInterval : [60]);
        setVolume(Array.isArray(settings.volume) ? settings.volume : [80]);
        setBgColor(settings.bgColor ?? '#fefdfb');
        setBorderColor(settings.borderColor ?? '#000000');
        setLat(settings.lat ?? null);
        setLon(settings.lon ?? null);
        setLocationLabel(settings.locationLabel ?? '');
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  const handleSave = async () => {
    if (saveMessage && saveMessage.includes('中')) return;
    
    // 地名が空でなければ、まず検索を試みる
    if (cityName) {
    setSaveMessage('場所を確認中...');
    try {
        const searchName = cityName.replace(/[市区町村]$/, "");
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchName)}&count=1&language=ja&format=json`);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
          const settings = {
            soundEnabled, autoChime, chimeInterval, volume, bgColor, borderColor,
            lat: result.latitude, lon: result.longitude, locationLabel: result.name
          };
          localStorage.setItem('chickenClockSettings', JSON.stringify(settings));
          setSaveMessage(`✅ ${result.name} に設定しました！`);
          setTimeout(() => navigate('/'), 1500);
          return;
      } else {
        setSaveMessage('❌ 場所が見つかりませんでした');
        setTimeout(() => setSaveMessage(''), 2000);
          return;
      }
    } catch (e) {
      setSaveMessage('⚠️ 通信エラー');
        return;
      }
    }
    
    // 地名入力がない場合は今の状態で保存
    const settings = {
      soundEnabled, autoChime, chimeInterval, volume, bgColor, borderColor, lat, lon, locationLabel
    };
    localStorage.setItem('chickenClockSettings', JSON.stringify(settings));
    setSaveMessage('✓ 設定を保存しました！');
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className="flex items-start justify-center p-8 min-h-screen bg-gray-100">
      <div 
        className="w-full max-w-2xl p-12 bg-white"
        style={{
          backgroundColor: bgColor,
          border: `4px solid ${borderColor}`,
          filter: 'url(#roughEdges)',
          boxShadow: '10px 10px 0px 0px rgba(0,0,0,1)',
          color: bgColor === '#2d3436' ? '#ffffff' : '#000000',
        }}
      >
       <h1 className="text-4xl font-bold mb-8">設定</h1>

        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">地域の設定</h2>
            <div className="space-y-4">
              <Label className="text-xl block">
                現在の場所: <span className="font-bold underline">{locationLabel || '未設定 (東京)'}</span>
              </Label>
              
              {/* --- ここから修正部分 --- */}
              <div className="relative w-full overflow-hidden">
                {/* 1. ガタガタしない、綺麗な白い背景層（これを追加！） */}
                <div className="absolute inset-0 bg-white border-2 border-black pointer-events-none rounded-sm"></div>

                {/* 2. ガタガタの「枠線」だけを担当する飾り（背景色を透明に！） */}
                <div 
                  className="absolute inset-0 bg-transparent border-2 border-black pointer-events-none rounded-sm" 
                  style={{ filter: 'url(#roughEdges)' }}
                ></div>
                
                {/* 3. 実際の入力欄（背景を透明にして、文字を綺麗に表示） */}
                <input
                  type="text"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  placeholder="例: 横浜、渋谷..."
                  className="relative w-full p-3 bg-transparent border-none outline-none text-black font-bold text-xl placeholder:text-gray-400"
                />
              </div>
              {/* --- ここまで --- */}
            </div>
          </div>

          <div className="space-y-6 pt-6" style={{ borderTop: `2px solid ${borderColor}` }}>
            <h2 className="text-2xl font-bold">自動鳴動設定</h2>
            <div className="flex items-center justify-between">
              <Label className="text-xl">自動的に鳩時計を鳴らす</Label>
              <Switch checked={autoChime} onCheckedChange={setAutoChime} />
            </div>
            {autoChime && (
              <div className="space-y-3">
                <Label className="text-lg">鳴動間隔: {chimeInterval[0] === 60 ? '毎時' : `${chimeInterval[0]}分ごと`}</Label>
                <Slider value={chimeInterval} onValueChange={setChimeInterval} min={15} max={120} step={15} />
              </div>
            )}
          </div>

          <div className="space-y-6 pt-6" style={{ borderTop: `2px solid ${borderColor}` }}>
            <h2 className="text-2xl font-bold">音の設定</h2>
            <div className="flex items-center justify-between">
              <Label className="text-xl">鳩時計の音を有効にする</Label>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>
            {soundEnabled && (
              <div className="space-y-3">
                <Label className="text-lg">音量: {volume[0]}%</Label>
                <Slider value={volume} onValueChange={setVolume} max={100} step={5} />
              </div>
            )}
          </div>

          {/* --- 既存のおすすめカラー一覧の下に追加 --- */}
          <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-200">
            <label className="block text-lg font-bold mb-3">🎨 好きな色を自由に選ぶ (RGB)</label>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border-2 border-black" style={{ filter: 'url(#roughEdges)' }}>
              {/* カラーピッカー本体 */}
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-16 h-16 cursor-pointer border-2 border-black bg-white p-1"
              />

              <div className="flex flex-col">
                <span className="text-sm font-bold opacity-70">カラーコード:</span>
                <span className="text-xl font-mono uppercase font-bold">{bgColor}</span>
              </div>

              <p className="ml-auto text-xs opacity-60 w-32">
                上の四角をクリックして、自由な色を選べます
              </p>
            </div>
          </div>
          {/* -------------------------------------- */}

          <div className="space-y-6 pt-6" style={{ borderTop: `2px solid ${borderColor}` }}>
            <h2 className="text-2xl font-bold">おすすめの着せ替え</h2>
            <div className="flex gap-3 flex-wrap">
              {[
                { name: '生成り', bg: '#fefdfb', border: '#000000' },
                { name: 'さくら', bg: '#fff5f5', border: '#d63031' },
                { name: 'わかば', bg: '#f7fff7', border: '#2d6a4f' },
                { name: 'あおぞら', bg: '#f0f7ff', border: '#0984e3' },
                { name: 'よぞら', bg: '#2d3436', border: '#dfe6e9' },
              ].map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => { setBgColor(preset.bg); setBorderColor(preset.border); }}
                  className="px-4 py-2 border-2 text-sm font-bold"
                  style={{ backgroundColor: preset.bg, borderColor: preset.border, color: preset.bg === '#2d3436' ? '#fff' : '#000', filter: 'url(#roughEdges)' }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={handleSave}
              className="w-full px-6 py-4 bg-black text-white text-xl font-bold active:scale-95"
              style={{ filter: 'url(#roughEdges)' }}
            >
              設定を保存して戻る
            </button>
            {saveMessage && <div className="mt-4 text-center text-lg font-bold">{saveMessage}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};