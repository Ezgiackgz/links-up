import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SubmitLink from '../SubmitLink.vue'
import Swal from 'sweetalert2'

vi.mock('sweetalert2') // SweetAlert modülünü mock ediyoruz, böylece gerçek modali açmadan test edebiliyoruz
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn() // router.push fonksiyonunu mock ediyoruz, böylece yönlendirmeyi test edebiliriz
  })
}))

describe('SubmitLink.vue', () => {
  beforeEach(() => {
    localStorage.clear(); // Her testten önce localStorage'ı temizliyoruz, böylece önceki testlerden kalan veriler etkilenmez
  });

  it('should show error if fields are empty', async () => {
    const wrapper = mount(SubmitLink); // Bileşeni mount ediyoruz, yani test edilebilir hale getiriyoruz

    await wrapper.find('form').trigger('submit.prevent'); // Formu submit ediyoruz (butona basmadan test ortamında tetikliyoruz)

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "error",
      title: "Zorunlu Alan",
      text: "Lütfen zorunlu alanları doldurunuz",
    }); // Form boş olduğunda hata mesajının gösterildiğini kontrol ediyoruz
  });

  it('should save link to localStorage and show success message', async () => {
    const wrapper = mount(SubmitLink);

    // Form alanlarını dolduruyoruz
    await wrapper.find('input[id="exampleInputText"]').setValue('Test Link');
    await wrapper.find('input[id="exampleInputUrl"]').setValue('https://test.com');

    // Formu submit ediyoruz
    await wrapper.find('form').trigger('submit.prevent');

    // localStorage'a kaydedilen verileri kontrol ediyoruz
    const storageLinks = JSON.parse(localStorage.getItem('links')); // localStorage'dan "links" verisini alıyoruz
    expect(storageLinks).toHaveLength(1); // localStorage'da 1 adet kayıt olmalı
    expect(storageLinks[0].name).toBe('Test Link'); // Kayıtlı linkin adı doğru mu kontrol ediyoruz
    expect(storageLinks[0].url).toBe('https://test.com'); // Kayıtlı linkin URL'si doğru mu kontrol ediyoruz

    // Başarı mesajının gösterildiğini kontrol ediyoruz
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "success",
      title: "Success!",
      text: "Link başarıyla eklendi.",
      timer: 2000,
      showConfirmButton: false
    });
  });

  it('should reset form fields after successful submission', async () => {
    const wrapper = mount(SubmitLink);

    // Form alanlarını dolduruyoruz
    await wrapper.find('input[id="exampleInputText"]').setValue('Test Link');
    await wrapper.find('input[id="exampleInputUrl"]').setValue('https://test.com');

    // Formu submit ediyoruz
    await wrapper.find('form').trigger('submit.prevent');

    // Form alanlarının sıfırlandığını kontrol ediyoruz
    expect(wrapper.find('input[id="exampleInputText"]').element.value).toBe(''); // Link adı sıfırlanmış mı?
    expect(wrapper.find('input[id="exampleInputUrl"]').element.value).toBe(''); // Link URL sıfırlanmış mı?
  });
});
