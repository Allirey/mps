import {observable, computed, action, decorate} from 'mobx';

class PostsStore {
   constructor(rootStore) {
      this.rootStore = rootStore;
   }

   async all() {
      return await this.rootStore.api.Posts.list()
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

decorate(PostsStore, {}
);

export default PostsStore;