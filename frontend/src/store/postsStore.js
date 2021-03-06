import {makeAutoObservable} from 'mobx';

class PostsStore {
   constructor(rootStore) {
      this.rootStore = rootStore;
      makeAutoObservable(this)
   }

   async all(page=1) {
      return await this.rootStore.api.Posts.listPage(page)
   }

   async create(slug,title,body) {
      return await this.rootStore.api.Posts.create(slug, title, body)
   }

   async getPost(slug) {
      return await this.rootStore.api.Posts.retrieve(slug)
   }

   async updatePost(slug, data) {
      return await this.rootStore.api.Posts.update(slug, data)
   }

   async deletePost(slug) {
      return await this.rootStore.api.Posts.delete(slug)
   }
}

export default PostsStore;