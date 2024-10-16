import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import LinkList from '../LinkList.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Swal from 'sweetalert2';

// Router'ı oluşturmak için bir yardımcı fonksiyon
const createRouterMock = () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: LinkList } // Test için router'ın yönlendirdiği rotaları tanımlıyoruz
    ]
  });
  router.push('/'); // Ana sayfaya yönlendiriyoruz
  return router;
};

describe('LinkList', () => {
  beforeEach(() => {
    localStorage.clear(); // Her testten önce localStorage'ı temizliyoruz
  });

  it('renders properly and shows the submit link button', () => {
    const wrapper = mount(LinkList, {
      global: {
        plugins: [createRouterMock()] // Router mockunu global olarak bileşene ekliyoruz
      }
    });
    expect(wrapper.text()).toContain('SUBMIT A LINK'); // Sayfa doğru render edilip "SUBMIT A LINK" butonunu içeriyor mu kontrol ediyoruz
  });

  it('displays links correctly', async () => {
    // localStorage'da örnek veriyi ayarlıyoruz
    const mockLinks = [
      { id: 1, name: 'Link 1', url: 'https://link1.com', upCount: 10, downCount: 2, createdDate: '2024-01-01' },
      { id: 2, name: 'Link 2', url: 'https://link2.com', upCount: 5, downCount: 1, createdDate: '2024-01-02' }
    ];

    localStorage.setItem('links', JSON.stringify(mockLinks)); // Mock verileri localStorage'a ekliyoruz

    const wrapper = mount(LinkList, {
      global: {
        plugins: [createRouterMock()] // Router mockunu yine ekliyoruz
      }
    });

    // localStorage'daki linklerin doğru şekilde render edildiğini kontrol ediyoruz
    expect(wrapper.findAll('.list-group-item').length).toBe(mockLinks.length); // Listede iki adet link var mı kontrol ediyoruz
    expect(wrapper.text()).toContain('Link 1'); // İlk linki kontrol ediyoruz
    expect(wrapper.text()).toContain('Link 2'); // İkinci linki kontrol ediyoruz
  });

  it('correctly updates the link counts on upVote and downVote', async () => {
    const mockLinks = [
      { id: 1, name: 'Link 1', url: 'https://link1.com', upCount: 10, downCount: 2, createdDate: '2024-01-01' }
    ];

    localStorage.setItem('links', JSON.stringify(mockLinks)); // Bir adet mock linki localStorage'a ekliyoruz

    const wrapper = mount(LinkList, {
      global: {
        plugins: [createRouterMock()] // Router mockunu ekliyoruz
      }
    });

    // UpVote butonuna tıklama simülasyonu
    await wrapper.find('button.btn-outline-success').trigger('click');

    // localStorage'dan veriyi güncelle ve kontrol et
    const updatedLinks = JSON.parse(localStorage.getItem('links'));
    expect(updatedLinks[0].upCount).toBe(11); // UpVote sayısının bir arttığını kontrol ediyoruz

    // DownVote butonuna tıklama simülasyonu
    await wrapper.find('button.btn-outline-danger').trigger('click');

    // localStorage'dan veriyi güncelle ve kontrol et
    const updatedLinksAfterDownVote = JSON.parse(localStorage.getItem('links'));
    expect(updatedLinksAfterDownVote[0].downCount).toBe(1); // DownVote sayısının bir azaldığını kontrol ediyoruz
  });

  it('calls the delete function when delete button is clicked', async () => {
    const mockLinks = [
      { id: 1, name: 'Link 1', url: 'https://link1.com', upCount: 10, downCount: 2, createdDate: '2024-01-01' }
    ];

    localStorage.setItem('links', JSON.stringify(mockLinks)); // Mock linki localStorage'a ekliyoruz

    const wrapper = mount(LinkList, {
      global: {
        plugins: [createRouterMock()], // Router mockunu ekliyoruz
        mocks: {
          $swal: Swal // Swal (SweetAlert) mockunu ekliyoruz
        }
      }
    });

    // Silme butonuna tıklama simülasyonu
    await wrapper.find('button.btn-outline-danger').trigger('click');

    // SweetAlert2 onay penceresini simüle etme
    vi.spyOn(Swal, 'fire').mockResolvedValue({ isConfirmed: true }); // Swal onay penceresi simülasyonu

    // Silme işlemini tetikle
    await wrapper.vm.openDeleteDialog(0);

    // localStorage'daki linkin silindiğini kontrol et
    const linksAfterDelete = JSON.parse(localStorage.getItem('links'));
    expect(linksAfterDelete.length).toBe(0); // Tüm linklerin silindiğini kontrol ediyoruz
  });
});
