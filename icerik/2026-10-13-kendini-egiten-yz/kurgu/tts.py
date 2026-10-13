import asyncio, json, ssl, edge_tts, edge_tts.communicate as ec
ec._SSL_CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
TEXT = ("Bu yapay zekâ kendi ödevini yapıyor, kendi notunu veriyor, sonra da kendini eğitiyor. Peki ne ters gidebilir? "
"Japon şirketi Sakana AI, MASS adında bir yöntem denedi. Tek bir model üç işi birden yapıyor. Bir: görevi çözüyor. İki: kendi çalışmasını puanlıyor. Üç: en iyi notu alan denemeleriyle kendini yeniden eğitiyor. "
"Sonuç? Araştırma görevlerinde gelişiyor, ama her alanda değil. Ve bir sorun var: Bir hatayı hem çözerken hem puanlarken kaçırırsa, onu başarı sanıyor ve o hatayı daha da iyi öğrenebilir. "
"Yani kör noktası, yani göremediği hata, zamanla pekişebilir. Araştırmacılar da bunu bir risk olarak görüyor. "
"Biz de böyle değil miyiz? Kendi yazını, kendi planını kontrol ederken gözünden kaçan şey, ikinci okumada da kaçar. "
"Ders basit: Önemli bir işte notunu başkasına da verdir. Sen en son kimden dürüst geri bildirim istedin? Yorumlara yaz, devamı için takip et.")
async def main():
    c = edge_tts.Communicate(TEXT.replace("MASS","Mass"), "tr-TR-AhmetNeural", rate="+22%", boundary="WordBoundary")
    words=[]
    with open("voice.mp3","wb") as f:
        async for ch in c.stream():
            if ch["type"]=="audio": f.write(ch["data"])
            elif ch["type"]=="WordBoundary":
                words.append([ch["text"], ch["offset"]/1e7, (ch["offset"]+ch["duration"])/1e7])
    json.dump(words, open("words.json","w"), ensure_ascii=False)
asyncio.run(main())
