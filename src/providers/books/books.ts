import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class BooksProvider {

  mockData = [
    {
      id: '1',
      title: 'Harry Potter Number one',
      text: 'First Readed book',
      image: 'https://firebasestorage.googleapis.com/v0/b/mybookeom.appspot.com/o/1.png?alt=media&token=4bc8dd49-d81a-4e3f-99f0-d74ef1644919'
    },
    {
      id: '2',
      title: 'Load of ring',
      text: 'Good at me',
      image: 'https://firebasestorage.googleapis.com/v0/b/mybookeom.appspot.com/o/2.png?alt=media&token=f868f629-1a88-4200-ad9f-65c2986c35ea'
    },
    {
      id: '3',
      title: 'Cafe homes',
      text: 'I like americano',
      image: 'https://firebasestorage.googleapis.com/v0/b/mybookeom.appspot.com/o/3.png?alt=media&token=12c69962-67f4-4c30-8dc3-f555992e7085'
    },
    {
      id: '4',
      title: 'Nami supermarket',
      text: 'Good bamletter',
      image: 'https://firebasestorage.googleapis.com/v0/b/mybookeom.appspot.com/o/4.png?alt=media&token=07180560-5e4e-4308-8e15-47876d3ad22a'
    },
    {
      id: '5',
      title: 'Young is heart',
      text: 'Im young let',
      image: 'https://firebasestorage.googleapis.com/v0/b/mybookeom.appspot.com/o/5.png?alt=media&token=ea0f0854-e055-4819-9b93-30d64ec73e36'
    },
    {
      id: '6',
      title: 'Good psycologist',
      text: 'Psychologist is amazing',
      image: 'https://firebasestorage.googleapis.com/v0/b/mybookeom.appspot.com/o/6.png?alt=media&token=35285554-9544-49ca-aa18-ff073cd4704a'
    },
    {
      id: '7',
      title: 'Black comedies',
      text: 'I like comedies',
      image: 'https://firebasestorage.googleapis.com/v0/b/mybookeom.appspot.com/o/7.png?alt=media&token=d3796350-b614-470e-b89b-97933da5df82'
    },
    {
      id: '8',
      title: 'Good at ballet',
      text: 'I can do everything',
      image: 'https://firebasestorage.googleapis.com/v0/b/mybookeom.appspot.com/o/8.png?alt=media&token=4e98782f-5467-409d-bf0a-dc286ede2085'
    },
    {
      id: '9',
      title: 'Dont sleep for history',
      text: 'Very fun',
      image: 'https://firebasestorage.googleapis.com/v0/b/mybookeom.appspot.com/o/9.png?alt=media&token=70419794-c99b-445b-b8a6-a85b05c4fdae'
    },
  ];

  constructor(public http: HttpClient) {

  }

  public getMyBooks() {
    return new Promise((resolve, reject) => {
      resolve(this.mockData)
    });
  }

  public addMyBook(data) {
    return new Promise((resolve, reject) => {
      this.mockData.unshift(data);
      resolve();
    });
  }

  public genMyBook(data) {
    return {
      id: this._genMyBookId(),
      title: data.title,
      text: data.text,
      image: data.image
    }
  }

  private _genMyBookId() {
    return '11';
  }

}
