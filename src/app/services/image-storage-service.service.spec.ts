import { TestBed } from '@angular/core/testing';

import { ImageStorageServiceService } from './image-storage-service.service';

describe('ImageStorageServiceService', () => {
  let service: ImageStorageServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageStorageServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
